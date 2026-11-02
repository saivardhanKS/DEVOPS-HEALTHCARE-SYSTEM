
pipeline {
    agent any

    environment {
        APP = 'medcare-healthcare'
        NS = 'devsecops-healthcare'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
        IMAGE = 'medcare-healthcare'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Source') {
            steps {
                sh '''
                    test -f index.html
                    test -f style.css
                    test -f script.js
                    test -f Dockerfile
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${IMAGE}:${BUILD_NUMBER} .
                    docker save ${IMAGE}:${BUILD_NUMBER} \
                      -o /tmp/${IMAGE}-${BUILD_NUMBER}.tar
                '''
            }
        }

        stage('Import Image into K3s') {
            steps {
                sh '''
                    sudo /usr/local/bin/k3s ctr images import \
                      /tmp/${IMAGE}-${BUILD_NUMBER}.tar
                '''
            }
        }

        stage('Deploy Green') {
            steps {
                sh '''
                    kubectl set image deployment/medcare-green \
                      *=${IMAGE}:${BUILD_NUMBER} -n ${NS}

                    kubectl rollout status deployment/medcare-green \
                      -n ${NS} --timeout=180s
                '''
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                sh '''
                    kubectl patch ingress medcare-ingress -n ${NS} \
                      --type=json \
                      -p='[{"op":"replace","path":"/spec/rules/0/http/paths/0/backend/service/name","value":"medcare-green-service"}]'

                    kubectl get ingress medcare-ingress -n ${NS}
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl get deployments,services,pods -n ${NS}
                    curl -f http://localhost/
                '''
            }
        }
    }

    post {
        success {
            echo 'MedCare CI/CD and Green Deployment completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Blue deployment remains available for recovery.'
        }
        always {
            sh 'rm -f /tmp/${IMAGE}-${BUILD_NUMBER}.tar'
        }
    }
}
