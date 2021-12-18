def getImageVersion() {
    return new Date().format('MMdd') + "_${env.BUILD_ID}"
}
def getImageName() {
    return "${params.NAMESPACE}/${params.PROJECT_NAME}"
}
pipeline {
    agent any
    environment {
        WEB_PUBLISH_DIR = "dist"
        REGISTRY_DOMAIN = "192.168.30.143:32768"
        REGISTRY_URL = "http://${REGISTRY_DOMAIN}"
        IMAGE_NAME = getImageName()
        IMAGE_VERSION = getImageVersion()
    }
    parameters {
        string(name: "NAMESPACE", defaultValue: "skuo", description: "What is your company name?")
        string(name: "PROJECT_NAME", defaultValue: "skuo-todo-frontend", description: "What is your project name?")
        string(name: "REMOTE_HOST_IP", defaultValue: "192.168.30.132", description: "What is the remote server you wish to deploy?")
        string(name: "EXPOSED_PORT", defaultValue: "todo", description: "Which port do you want to publish the website?")
    }
    stages {
        stage('Project build') {
            steps {
                // Enter workspace
                dir("${env.WORKSPACE}") {
                    echo 'build project ...'
                    sh 'npm install -g yarn'
                    // install npm packages
                    sh 'if [ -d "node_modules" ]; then rm -rf node_modules; fi; yarn install'
                    // Publish the project to directory
                    sh 'yarn run build'
                    // Copy Dockerfile and .dockerignore to prepare to build a new docker image
                    sh 'cp Dockerfile .dockerignore default.conf ${WEB_PUBLISH_DIR}/'
                }
            }
        }
        stage('Image build') {
            steps {
                // Enter publish directory
                dir("${env.WORKSPACE}/${WEB_PUBLISH_DIR}") {
                    // Build a new docker image
                    sh 'docker build -t ${IMAGE_NAME} .'
                    // Tag the new image with the private registry
                    sh 'docker tag ${IMAGE_NAME} ${REGISTRY_DOMAIN}/${IMAGE_NAME}:${IMAGE_VERSION}'
                }
                
                echo 'Push to private registry ...'
                // Push the tagged image to private registry
                sh 'docker push ${REGISTRY_DOMAIN}/${IMAGE_NAME}:${IMAGE_VERSION}'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploy on the remote server'
                script {
                    def remote = [:]
                    remote.name = "server-${params.REMOTE_HOST_IP}"
                    remote.host = "${params.REMOTE_HOST_IP}"
                    remote.port = 22
                    remote.allowAnyHosts = true
                    withCredentials([usernamePassword(credentialsId: "${params.REMOTE_HOST_IP}", passwordVariable: 'password', usernameVariable: 'userName')]) {
                        remote.user = "${userName}"
                        remote.password = "${password}"
                    }
                    sshCommand remote: remote, command: "docker pull ${REGISTRY_DOMAIN}/${IMAGE_NAME}:${IMAGE_VERSION}"
                    sshCommand remote: remote, command: "docker ps | grep ${params.PROJECT_NAME}: | awk '{print \$1}' | xargs docker stop", failOnError: false
                    sshCommand remote: remote, command: "docker system prune -f"
                    sshCommand remote: remote, command: "docker run \
                        -dp ${params.EXPOSED_PORT}:80 \
                        --name ${params.PROJECT_NAME} \
                        --restart always \
                        ${REGISTRY_DOMAIN}/${IMAGE_NAME}:${IMAGE_VERSION}"
                }
            }
        }
    }
}