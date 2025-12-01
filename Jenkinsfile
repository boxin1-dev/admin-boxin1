pipeline {
    agent any

    stages {
        stage('Load Environment Variables') {
            steps {
                script {
                    echo "📥 Chargement des variables d'environnement depuis le fichier .env..."
                        
                    def props = [:]

                    // Charger le fichier .env depuis Jenkins Credentials
                    withCredentials([file(credentialsId: 'boxin1-credentials', variable: 'ENV_FILE')]) {
                        props = readProperties file: "${ENV_FILE}"

                        props.each { key, value ->
                            env."${key}" = value

                            // Masquer les valeurs sensibles dans les logs
                            if (key.contains('PASSWORD') || key.contains('KEY') || key.contains('SECRET') || key.contains('TOKEN')) {
                                echo "✅ ${key}: ****"
                            } else {
                                echo "✅ ${key}: ${value}"
                            }
                        }
                    }

                    echo "✅ ${props.size()} variables d'environnement chargées avec succès !"
                }
            }
        }


        // ========== SETUP DATABASE ==========
        stage('Cleanup Old Database Container') {
            steps {
                script {
                    sh '''
                        echo "🧹 Nettoyage des anciens containers de base de données..."
                        docker stop ${POSTGRES_CONTAINER} || true
                        docker rm ${POSTGRES_CONTAINER} || true
                    '''
                }
            }
        }
    

        stage('Create Docker Network') {
            steps {
                sh '''
                    echo "🌐 Création du réseau Docker..."
                    docker network create ${NETWORK_NAME} || echo "Network already exists"
                '''
            }
        }
        

        stage('Start PostgreSQL Container') {
            steps {
                sh '''
                    echo "🚀 Démarrage du container PostgreSQL..."
                    docker run -d \
                        --name ${POSTGRES_CONTAINER} \
                        --network ${NETWORK_NAME} \
                        -e POSTGRES_USER=${POSTGRES_USER} \
                        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
                        -e POSTGRES_DB=${POSTGRES_DB} \
                        -e POSTGRES_INITDB_ARGS="--encoding=UTF-8 --lc-collate=C --lc-ctype=C" \
                        -v ${POSTGRES_VOLUME}:/var/lib/postgresql/data \
                        -p 5434:${POSTGRES_PORT} \
                        postgres:16 \
                        postgres \
                            -c log_statement=none \
                            -c log_destination=stderr \
                            -c log_min_messages=warning \
                            -c shared_preload_libraries=pg_stat_statements \
                            -c max_connections=100 \
                            -c shared_buffers=256MB \
                            -c effective_cache_size=1GB
                    
                    echo "⏳ Attente du démarrage de PostgreSQL..."
                    sleep 10
                '''
            }
        }

        stage('Clone repo for Migrations') {
            steps {
                sh '''
                    MIGRATION_DIR="Boxin1_migrations"
                    
                    if [ -d "${MIGRATION_DIR}/.git" ]; then
                        echo "📦 Le dossier ${MIGRATION_DIR} existe déjà. Mise à jour du dépôt..."
                        cd ${MIGRATION_DIR}
                        git fetch --all
                        git reset --hard origin/${REPO_BRANCH}
                        git pull origin ${REPO_BRANCH}
                    else
                        echo "📥 Clonage du dépôt ${REPO_MAIN}..."
                        git clone https://${GITHUB_TOKEN}@github.com/${REPO_MAIN} ${MIGRATION_DIR}
                    fi
                '''
            }
        }
        
        
        stage('Apply Prisma Migrations') {
            steps {
                sh '''
                    echo "🔄 Applying Prisma migrations..."

                    docker run --rm \
                        --network ${NETWORK_NAME} \
                        -v $(pwd)/${MIGRATION_DIR}/prisma:/app/prisma \
                        -w /app \
                        node:20 bash -c "
                            npm install -g prisma@6.18.0
                            export DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER}:${POSTGRES_PORT}/${POSTGRES_DB}
                            prisma migrate deploy
                        "
                '''
            }
        }
        
        
        stage('Seed database') {
            steps {
                sh '''
                    echo "🌱 Seeding database..."

                    docker run --rm \
                        --network ${NETWORK_NAME} \
                        -v $(pwd)/${MIGRATION_DIR}/prisma:/app/prisma \
                        -v $(pwd)/${MIGRATION_DIR}/src:/app/src \
                        -w /app \
                        node:20 bash -c "
                            npm install -g prisma@6.18.0 tsx
                            npm install dotenv @prisma/client
                            export DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER}:${POSTGRES_PORT}/${POSTGRES_DB}
                            prisma generate --schema=./prisma/schema.prisma
                            tsx prisma/seed.ts
                        "
                '''
            }
        }


        stage('Verify Database') {
            steps {
                sh '''
                    echo "✅ Vérification de la base de données..."
                    docker exec ${POSTGRES_CONTAINER} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "\\dt"
                '''
            }
        }        




        // ========== SETUP APPLICATION ==========       
        stage('Cleanup Old App Containers') {
            steps {
                sh '''
                    echo "🧹 Nettoyage des anciens containers d'application..."
                    docker stop ${APP_CONTAINER} || true
                    docker rm ${APP_CONTAINER} || true
                '''
            }
        }

        stage('Clone repo for Build') {
            steps {
                sh '''
                    if [ -d "${WORKSPACE_DIR}/.git" ]; then
                        echo "📦 Le dossier ${WORKSPACE_DIR} existe déjà. Mise à jour du dépôt..."
                        cd ${WORKSPACE_DIR}
                        git fetch --all
                        git reset --hard origin/${REPO_BRANCH}
                        git pull origin ${REPO_BRANCH}
                    else
                        echo "📥 Clonage du dépôt ${REPO_MAIN}..."
                        git clone https://${GITHUB_TOKEN}@github.com/${REPO_MAIN} ${WORKSPACE_DIR}
                    fi
                '''
            }
        }
        

        stage('Build Docker Image') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    sh '''
                        echo "🐳 Build des images Docker..."

                        # Build APP
                        docker build -t ${APP_IMAGE} \
                            --build-arg DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public" \
                            --build-arg RESEND_KEY=${RESEND_KEY} \
                            --build-arg BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET} \
                            .
                    '''
                }
            }
        }

        stage('Deploy App Container') {
            steps {
                sh '''
                    echo "🚀 Déploiement du container...."
                    
                    # App Instance 
                    docker run -d \
                        --name ${APP_CONTAINER} \
                        --network ${NETWORK_NAME} \
                        -p 4000:${APP_PORT} \
                        -e NODE_ENV=production \
                        -e DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_CONTAINER}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public" \
                        -e BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET} \
                        -e RESEND_KEY=${RESEND_KEY} \
                        ${APP_IMAGE} \
                    
                    echo "⏳ Attente du démarrage de l'applications Web..."
                    sleep 5
                '''
            }
        }
    }



    post {
        success {
            echo "✅ Déploiement réussi!"
            sh '''
                echo "📊 État du container:"
                docker ps | grep ${APP_CONTAINER}
            '''
        }
        failure {
            echo "❌ Échec du déploiement"
            sh '''
                echo "📋 Logs des containers:"
                docker logs ${APP_CONTAINER} --tail 50 || true
                docker logs ${POSTGRES_CONTAINER} --tail 50 || true
                
            '''
        }
        cleanup {
            sh '''
                rm -rf Boxin1_migrations
            '''
        }
    }
}