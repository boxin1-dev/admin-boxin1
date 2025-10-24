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
}