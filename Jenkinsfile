pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
        nodejs 'Node-18'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                echo 'Code récupéré depuis GitHub'
            }
        }

        stage('Backend - Build & Test') {
            steps {
                dir('library-management') {
                    bat 'mvn clean package -DskipTests' 
                    // Si tu es sur Linux, utilise: sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('library-frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                    // Sur Linux: sh 'npm ci && npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker-compose build'
                // Sur Linux: sh 'docker-compose build'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                bat 'docker-compose up -d'
                // Sur Linux: sh 'docker-compose up -d'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'docker ps'
                bat 'docker-compose logs --tail=50'
            }
        }
    }

    post {
        success {
            echo 'Déploiement BookNest-Library réussi ! Frontend: http://localhost:3000 | Backend: http://localhost:8080'
        }
        failure {
            echo ' Échec du pipeline - Vérifier les logs'
            bat 'docker-compose logs'
        }
        always {
            echo 'Nettoyage...'
        }
    }
}
