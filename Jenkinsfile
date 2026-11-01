
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out MedCare Healthcare source code'
                checkout scm
            }
        }

        stage('Validate Source') {
            steps {
                echo 'Checking project files'

                sh '''
                    test -f index.html
                    test -f style.css
                    test -f script.js
                    test -f Dockerfile

                    echo "All required files are present."
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building MedCare Healthcare Docker image'

                sh '''
                    docker build -t medcare-healthcare:latest .
                '''
            }
        }
    }

    post {
        success {
            echo 'MedCare Healthcare pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
