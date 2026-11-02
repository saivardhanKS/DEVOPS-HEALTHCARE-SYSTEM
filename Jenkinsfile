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

        stage('Verify Green Directly') {
            steps {
                sh '''
                    GREEN_IP=$(kubectl get service medcare-green-service \
                      -n ${NS} -o jsonpath='{.spec.clusterIP}')

                    echo "Testing green service at ${GREEN_IP}"

                    for i in $(seq 1 10); do
                        if curl -fsS --max-time 5 \
                          "http://${GREEN_IP}/" -o /dev/null; then
                            echo "Green service verification successful"
                            exit 0
                        fi

                        echo "Green service not responding yet. Retry ${i}/10"
                        sleep 3
                    done

                    echo "Green service verification failed"
                    exit 1
                '''
            }
        }

        stage('Switch Traffic') {
            steps {
                sh '''
                    kubectl patch ingress medcare-ingress -n ${NS} \
                      --type=json \
                      -p='[{"op":"replace","path":"/spec/rules/0/http/paths/0/backend/service/name","value":"medcare-green-service"}]'

                    echo "Waiting for Traefik to route traffic to green"

                    for i in $(seq 1 10); do
                        if curl -fsS --max-time 5 \
                          http://localhost/ -o /dev/null; then
                            echo "Green traffic verification successful"
                            exit 0
                        fi

                        echo "Ingress not ready yet. Retry ${i}/10"
                        sleep 3
                    done

                    echo "Ingress verification failed"
                    exit 1
                '''
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed. Restoring traffic to blue.'
            sh '''
                kubectl patch ingress medcare-ingress -n ${NS} \
                  --type=json \
                  -p='[{"op":"replace","path":"/spec/rules/0/http/paths/0/backend/service/name","value":"medcare-service"}]' \
                  || true
            '''
        }

        success {
            echo 'MedCare CI/CD deployment completed successfully!'
        }

        always {
            sh 'rm -f /tmp/${IMAGE}-${BUILD_NUMBER}.tar'
        }
    }
}