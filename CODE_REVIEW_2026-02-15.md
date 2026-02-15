# Rapport de Revue de Code : GBA Portal

**Date :** 15 Février 2026
**Projet :** `gba-portal`
**Version auditée :** `HEAD` (Next.js 15, Tailwind v4)

---

## 1. Résumé Exécutif

Le projet `gba-portal` présente une base solide et moderne, tirant parti des dernières fonctionnalités de Next.js 15 (App Router, Server Actions) et de Supabase. L'interface semble soignée (approche "cinématique" et "premium").

Cependant, **l'application présente des failles de sécurité critiques au niveau du contrôle d'accès (Authorization)**. Si l'authentification est gérée par Supabase, plusieurs actions serveur ("Server Actions") effectuent des mutations de données sans vérifier le rôle de l'utilisateur, se reposant uniquement sur l'interface utilisateur pour masquer les boutons.

L'architecture est cohérente mais souffre d'une certaine duplication de code et de composants "Client" parfois monolithiques.

**Note globale : B-** (Bonne base technique, mais sécurité backend à revoir d'urgence).

---

## 2. Points Critiques (Priorité Haute 🔴)

Ces problèmes posent un risque immédiat de sécurité ou de stabilité et doivent être corrigés avant toute mise en production.

### 2.1. Absence de vérification des rôles dans les Server Actions
Plusieurs fichiers d'actions serveur effectuent des opérations d'écriture (INSERT, UPDATE, DELETE) sans vérifier si l'utilisateur a le rôle `admin` ou `staff`. Un utilisateur malveillant connecté pourrait invoquer ces actions directement.

*   **Fichiers concernés :**
    *   `src/app/dashboard/categories/actions.ts` : `createCategory`, `updateCategory`, `deleteCategory`.
    *   `src/app/dashboard/competitions/actions.ts` : `createCompetition`, `deleteCompetition`.
*   **Risque :** Un coach ou un utilisateur "viewer" peut supprimer ou altérer les catégories et résultats du club.
*   **Correction :** Ajouter systématiquement `requireRole('admin')` ou `requireRole('staff')` (via `@/lib/dashboard/authz`) au début de chaque fonction exportée.

### 2.2. Validation des données insuffisante (Zod manquant)
De nombreuses Server Actions acceptent des objets `FormData` et castent directement les valeurs (ex: `formData.get('name') as string`) sans validation stricte.
*   **Risque :** Injection de données invalides, plantages serveur, ou corruption de données.
*   **Correction :** Utiliser `zod` pour valider tous les inputs dans les Server Actions (comme fait partiellement dans `equipes/actions.ts`).

### 2.3. Shim de typage dangereux
Le fichier `src/types/framer-motion.d.ts` force le module `framer-motion` en `any`.
*   **Risque :** Perte totale de la sécurité de typage sur les animations, pouvant mener à des bugs de runtime silencieux lors des mises à jour de librairies.

---

## 3. Améliorations Suggérées (Priorité Moyenne 🟠)

Ces points concernent la maintenabilité, la performance et les bonnes pratiques.

### 3.1. Duplication de code (Composants)
Il existe une confusion entre les composants partagés et les composants spécifiques aux pages.
*   **Doublons identifiés :**
    *   `src/components/dashboard/CreatePlayerModal.tsx`
    *   `src/components/dashboard/players/CreatePlayerModal.tsx`
    *   Ces deux fichiers semblent avoir des objectifs similaires mais des implémentations divergentes.
*   **Action :** Fusionner ces composants ou supprimer la version obsolète.

### 3.2. Refactoring des "God Components"
Certains composants clients sont trop volumineux et gèrent trop de responsabilités (UI + Logique métier + Persistance locale).
*   **Cible :** `src/app/dashboard/equipements/EquipementsClient.tsx` (~800 lignes).
*   **Problème :** Il mélange la gestion de l'état local, la synchronisation `localStorage`, la logique de filtrage complexe et le rendu UI.
*   **Action :** Extraire la logique dans des custom hooks (ex: `useEquipmentFilters`, `useEquipmentPersistence`) et découper l'UI en sous-composants (`EquipmentList`, `EquipmentFilters`).

### 3.3. Gestion de l'état "Hybride" (LocalStorage vs Serveur)
L'application utilise beaucoup `localStorage` pour persister des états (filtres, mais parfois données comme dans `approvals.ts` ou `EquipementsClient.tsx`).
*   **Risque :** Désynchronisation entre le client et le serveur (Supabase). Si un admin valide une demande sur son PC, un autre admin ne le verra pas si l'état est stocké localement.
*   **Action :** Migrer la gestion d'état critique vers Supabase (tables existantes) et utiliser `SWR` ou `React Query` (ou simplement `useRouter.refresh()` comme déjà fait ailleurs) pour la synchro.

---

## 4. Nitpicks (Priorité Basse 🟢)

Détails pour polir le projet.

*   **Nettoyage :** Supprimer les fichiers de backup qui polluent le dépôt :
    *   `src/styles/globals.css.bak`
    *   `tailwind.config.js.bak`
    *   `postcss.config.cjs.bak`
    *   `eslint.config.mjs.bak`
*   **Code mort :**
    *   `src/components/dashboard/ConstructionPage.tsx` semble inutilisé.
    *   `src/lib/mocks/` contient beaucoup de données en dur qui ne devraient plus être utilisées si le backend est branché.
*   **Linting :** Plusieurs fichiers utilisent `// eslint-disable-next-line react-hooks/exhaustive-deps`. Il vaut mieux corriger les dépendances des `useEffect` plutôt que de les masquer.

---

## 5. Plan d'action recommandé

1.  🔒 **Sécurité :** Appliquer `requireRole` sur TOUTES les Server Actions dans `src/app/dashboard/*/actions.ts`.
2.  🧹 **Nettoyage :** Supprimer les fichiers `.bak` et les composants dupliqués.
3.  🏗 **Refactor :** Extraire la logique de `EquipementsClient`.
4.  ✅ **Validation :** Ajouter Zod sur les mutations critiques.
