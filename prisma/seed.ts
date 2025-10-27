import "dotenv/config";
import { PrismaClient } from '../src/generated/client';
const prisma = new PrismaClient();

async function main() {
  const texts = [
    // ---- Section: Dashboard Header ----
    { key: 'dashboard.title', value: 'Tableau de bord', lang: 'fr' },
    { key: 'dashboard.subtitle', value: 'Une maison intelligente', lang: 'fr' },

    // ---- Section: Welcome ----
    { key: 'welcome.title', value: 'Bienvenue sur Boxin1', lang: 'fr' },
    { key: 'welcome.subtitle', value: 'Votre partenaire pour la transformation de votre maison en maison intelligente', lang: 'fr' },

    // ---- Section: About ----
    { key: 'about.title', value: 'À propos de Boxin1', lang: 'fr' },
    { key: 'about.text', value: 'Boxin1 est une entreprise innovante spécialisée dans la transformation des habitations traditionnelles en maisons intelligentes connectées. Nous rendons la technologie accessible à tous.', lang: 'fr' },

    // ---- Section: Application ----
    { key: 'app.title', value: 'Notre Application', lang: 'fr' },
    { key: 'app.text', value: 'Cette plateforme vous permet de contrôler, surveiller et automatiser tous les aspects de votre maison intelligente depuis n\'importe où, à tout moment.', lang: 'fr' },
    { key: 'app.button', value: 'Explorer les Fonctionnalités', lang: 'fr' },

    // ---- Section: Statistics ----
    { key: 'stats.homes', value: '10,000+ Maisons Transformées', lang: 'fr' },
    { key: 'stats.devices', value: '500+ Appareils Compatibles', lang: 'fr' },
    { key: 'stats.uptime', value: '99.9% Temps de Fonctionnement', lang: 'fr' },
    { key: 'stats.support', value: '24/7 Support Client', lang: 'fr' },

    // ---- Section: Features ----
    { key: 'features.title', value: 'Fonctionnalités Principales', lang: 'fr' },
    { key: 'features.control.title', value: 'Contrôle Centralisé', lang: 'fr' },
    { key: 'features.control.text', value: 'Gérez tous vos appareils intelligents depuis une seule interface intuitive.', lang: 'fr' },
    { key: 'features.automation.title', value: 'Automatisation', lang: 'fr' },
    { key: 'features.automation.text', value: 'Créez des scénarios personnalisés pour automatiser votre quotidien.', lang: 'fr' },
    { key: 'features.security.title', value: 'Sécurité Avancée', lang: 'fr' },
    { key: 'features.security.text', value: 'Surveillance et contrôle d\'accès avec notifications en temps réel.', lang: 'fr' },
    { key: 'features.energy.title', value: 'Économie d\'Énergie', lang: 'fr' },
    { key: 'features.energy.text', value: 'Optimisez votre consommation énergétique avec l\'intelligence artificielle.', lang: 'fr' },

    // ---- Section: Quick Start ----
    { key: 'quickstart.title', value: 'Démarrage Rapide', lang: 'fr' },
    { key: 'quickstart.step1', value: 'Connectez vos appareils', lang: 'fr' },
    { key: 'quickstart.step2', value: 'Configurez vos préférences', lang: 'fr' },
    { key: 'quickstart.step3', value: 'Profitez de votre maison intelligente', lang: 'fr' },

    // ---- Section: Mobile Control ----
    { key: 'mobilecontrol.title', value: 'Contrôle Mobile', lang: 'fr' },
    { key: 'mobilecontrol.text', value: "Accédez à votre maison depuis n'importe où avec notre application mobile. Contrôlez l'éclairage, la température, la sécurité et bien plus encore.", lang: 'fr' },
    { key: 'mobilecontrol.tags', value: 'iOS, Android, Web', lang: 'fr' },

    // ---- Section: CTA ----
    { key: 'cta.title', value: 'Prêt à transformer votre maison ?', lang: 'fr' },
    { key: 'cta.text', value: 'Découvrez toutes les possibilités que Boxin1 peut offrir à votre domicile.', lang: 'fr' },
    { key: 'cta.button', value: 'Commencer', lang: 'fr' },

    // ---- Section: Footer / Status ----
    { key: 'status.online', value: 'Système en ligne', lang: 'fr' },

    // ---- Section: Profile Page ----
    { key: 'profile.title', value: 'Paramètres du compte', lang: 'fr' },
    { key: 'profile.subtitle', value: 'Gérer vos informations et vos paramètres du compte', lang: 'fr' },

    // Profile Information
    { key: 'profile.info.title', value: 'Informations du profil', lang: 'fr' },
    { key: 'profile.info.changePhoto', value: 'Changer la photo', lang: 'fr' },
    { key: 'profile.info.photoFormat', value: 'JPG, GIF ou PNG. Max 2MB.', lang: 'fr' },
    { key: 'profile.info.firstName', value: 'Prénom', lang: 'fr' },
    { key: 'profile.info.lastName', value: 'Nom', lang: 'fr' },
    { key: 'profile.info.email', value: 'Email', lang: 'fr' },
    { key: 'profile.info.phone', value: 'Téléphone', lang: 'fr' },

    // Security Section
    { key: 'profile.security.title', value: 'Sécurité', lang: 'fr' },
    { key: 'profile.security.currentPassword', value: 'Mot de passe actuel', lang: 'fr' },
    { key: 'profile.security.currentPasswordPlaceholder', value: 'Entrez votre mot de passe actuel', lang: 'fr' },
    { key: 'profile.security.newPassword', value: 'Nouveau mot de passe', lang: 'fr' },
    { key: 'profile.security.newPasswordPlaceholder', value: 'Entrez un nouveau mot de passe', lang: 'fr' },
    { key: 'profile.security.confirmPassword', value: 'Confirmer le mot de passe', lang: 'fr' },
    { key: 'profile.security.confirmPasswordPlaceholder', value: 'Confirmez votre nouveau mot de passe', lang: 'fr' },
    { key: 'profile.security.twoFactor', value: 'Authentification à deux facteurs', lang: 'fr' },
    { key: 'profile.security.twoFactorDesc', value: 'Sécurisez davantage votre compte', lang: 'fr' },
    { key: 'profile.security.activate', value: 'Activer', lang: 'fr' },

    // App Preferences
    { key: 'profile.preferences.title', value: 'Préférences de l\'application', lang: 'fr' },
    { key: 'profile.preferences.pushNotifications', value: 'Notifications push', lang: 'fr' },
    { key: 'profile.preferences.pushNotificationsDesc', value: 'Recevoir des notifications sur votre appareil', lang: 'fr' },
    { key: 'profile.preferences.emailNotifications', value: 'Notifications email', lang: 'fr' },
    { key: 'profile.preferences.emailNotificationsDesc', value: 'Recevoir des emails de l\'application', lang: 'fr' },
    { key: 'profile.preferences.darkMode', value: 'Mode sombre', lang: 'fr' },
    { key: 'profile.preferences.darkModeDesc', value: 'Utiliser le thème sombre', lang: 'fr' },
    { key: 'profile.preferences.language', value: 'Langue', lang: 'fr' },
    { key: 'profile.preferences.languageFr', value: 'Français', lang: 'fr' },
    { key: 'profile.preferences.languageEn', value: 'English', lang: 'fr' },
    { key: 'profile.preferences.languageEs', value: 'Español', lang: 'fr' },
    { key: 'profile.preferences.languageDe', value: 'Deutsch', lang: 'fr' },

    // Privacy and Data
    { key: 'profile.privacy.title', value: 'Confidentialité et données', lang: 'fr' },
    { key: 'profile.privacy.publicProfile', value: 'Profil public', lang: 'fr' },
    { key: 'profile.privacy.publicProfileDesc', value: 'Permettre aux autres utilisateurs de voir votre profil', lang: 'fr' },
    { key: 'profile.privacy.usageData', value: 'Données d\'usage', lang: 'fr' },
    { key: 'profile.privacy.usageDataDesc', value: 'Partager des données anonymes pour améliorer l\'app', lang: 'fr' },
    { key: 'profile.privacy.downloadData', value: 'Télécharger mes données', lang: 'fr' },
    { key: 'profile.privacy.deleteAccount', value: 'Supprimer mon compte', lang: 'fr' },

    // Actions
    { key: 'profile.actions.cancel', value: 'Annuler les modifications', lang: 'fr' },
    { key: 'profile.actions.reset', value: 'Réinitialiser', lang: 'fr' },
    { key: 'profile.actions.save', value: 'Sauvegarder', lang: 'fr' },
  ];

  for (const entry of texts) {
    await prisma.textEntry.upsert({
      where: { key: entry.key },
      update: { value: entry.value, lang: entry.lang },
      create: entry,
    });
  }

  console.log('✅ Text entries seeded successfully');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());