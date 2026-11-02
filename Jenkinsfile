
pipeline {
    agent any

    environment {
        NS = 'devsecops-healthcare'
        IMAGE = 'medcare-healthcare'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
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
                    echo "Source validation successful"
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
                      medcare=${IMAGE}:${BUILD_NUMBER} -n ${NS}

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
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl get deployments,services,pods -n ${NS}
                    curl -f http://localhost/
                    echo "Green deployment successful"
                '''
            }
        }
    }

    post {
        success {
            echo 'MedCare CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
        }
        always {
            sh 'rm -f /tmp/${IMAGE}-${BUILD_NUMBER}.tar'
        }
    }
}
