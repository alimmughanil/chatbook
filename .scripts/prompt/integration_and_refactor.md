You are a senior Fullstack AI Agent (Laravel + Inertia.js + React) assigned to audit and fix the codebase so it is 100% consistent with the database schema. The ONLY source of truth is the folder: database/migrations.

OBJECTIVE
- Audit and fix all files listed below so they fully match the database migrations.
- Eliminate runtime, type, props, validation, relationship, and API mismatches.
- If any field, relation, enum, argument, component, or UI assumes data that does NOT exist in migrations, it MUST be removed or corrected (do NOT “adjust migrations” to fit the code).

FILES THAT MUST BE AUDITED (check ALL of them):
- app/Enums/OrderStatusType.php
- app/Enums/OrderType.php
- app/Enums/PaymentStatusType.php
- app/Enums/PaymentType.php
- app/Enums/ProductStatusType.php
- app/Enums/ProductType.php
- app/Enums/PublishStatusType.php
- app/Http/Controllers/Admin/BlogCategoryController.php
- app/Http/Controllers/Admin/BlogController.php
- app/Http/Controllers/Admin/ContactController.php
- app/Http/Controllers/Admin/OrderController.php
- app/Http/Controllers/Admin/ProductController.php
- app/Http/Controllers/ContactController.php
- app/Http/Controllers/User/BlogController.php
- app/Http/Controllers/User/CategoryController.php
- app/Http/Controllers/User/Dashboard/OrderController.php
- app/Http/Controllers/User/Dashboard/TransactionController.php
- app/Http/Controllers/User/Module/FeedbackController.php
- app/Http/Controllers/User/OrderController.php
- app/Http/Controllers/User/PaymentController.php
- app/Http/Controllers/User/PortfolioController.php
- app/Http/Controllers/User/ProductController.php
- app/Http/Controllers/User/ProfileController.php
- app/Http/Services/Payment/Duitku/DisbursementService.php
- app/Http/Services/Payment/Duitku/OrderService.php
- app/Http/Services/Payment/Duitku/PaymentService.php
- app/Http/Services/SchemaService.php
- app/Http/Services/SeoService.php
- app/Http/Services/ServiceInterface.php
- app/Models/Blog.php
- app/Models/BlogCategory.php
- app/Models/BlogImage.php
- app/Models/Contact.php
- app/Models/Image.php
- app/Models/Order.php
- app/Models/Payment.php
- app/Models/Product.php
- database/migrations/2025_12_10_000006_create_categories_table.php
- database/migrations/2025_12_10_000007_create_blog_categories_table.php
- database/migrations/2025_12_10_000008_create_blogs_table.php
- database/migrations/2025_12_10_000011_create_products_table.php
- database/migrations/2025_12_10_000013_create_blog_images_table.php
- database/migrations/2025_12_10_000014_create_orders_table.php
- database/migrations/2025_12_10_000015_create_payments_table.php
- database/migrations/2025_12_10_000028_create_contacts_table.php
- resources/js/Pages/Admin/Blog/Create.jsx
- resources/js/Pages/Admin/Blog/Edit.jsx
- resources/js/Pages/Admin/Blog/Form/MainForm.jsx
- resources/js/Pages/Admin/Blog/Index.jsx
- resources/js/Pages/Admin/BlogCategory/Create.jsx
- resources/js/Pages/Admin/BlogCategory/Edit.jsx
- resources/js/Pages/Admin/BlogCategory/Form/MainForm.jsx
- resources/js/Pages/Admin/BlogCategory/Index.jsx
- resources/js/Pages/Admin/Contact/Index.jsx
- resources/js/Pages/Admin/Contact/Show.jsx
- resources/js/Pages/Admin/Order/Create.jsx
- resources/js/Pages/Admin/Order/Form/MainForm.jsx
- resources/js/Pages/Admin/Order/Form/OrderForm.jsx
- resources/js/Pages/Admin/Order/Index.jsx
- resources/js/Pages/Admin/Order/Modal/CancelModal.jsx
- resources/js/Pages/Admin/Order/Modal/DetailModal.jsx
- resources/js/Pages/Admin/Order/Modal/FinishModal.jsx
- resources/js/Pages/Admin/Order/Modal/HistoryModal.jsx
- resources/js/Pages/Admin/Order/Modal/SubmitModal.jsx
- resources/js/Pages/Admin/Product/Create.jsx
- resources/js/Pages/Admin/Product/Edit.jsx
- resources/js/Pages/Admin/Product/Form/MainForm.jsx
- resources/js/Pages/Admin/Product/Form/ProductForm.jsx
- resources/js/Pages/Admin/Product/Index.jsx
- resources/js/Pages/Admin/Product/Modal/AddImageModal.jsx
- resources/js/Pages/Admin/Product/Modal/DeleteModal.jsx
- resources/js/Pages/Admin/Product/Modal/DeleteThumbnailModal.jsx
- resources/js/Pages/Admin/Product/Modal/PublishModal.jsx
- resources/js/Pages/Admin/Product/Packet/Form/ProductDetailForm.jsx
- resources/js/Pages/Admin/Product/Packet/Index.jsx
- resources/js/Pages/Admin/Product/Packet/Modal/DeleteModal.jsx
- resources/js/Pages/Admin/Product/Section/DraggableFeatured.jsx
- resources/js/Pages/Admin/Product/Show.jsx
- resources/js/Pages/Home/About.jsx
- resources/js/Pages/Home/Contact.jsx
- resources/js/Pages/Home/ContactShow.jsx
- resources/js/Pages/Home/Disclaimer.jsx
- resources/js/Pages/Home/Index.jsx
- resources/js/Pages/Home/Privacy.jsx
- resources/js/Pages/User/Category/Index.jsx
- resources/js/Pages/User/Dashboard/Order/Index.jsx
- resources/js/Pages/User/Dashboard/Order/Show.jsx
- resources/js/Pages/User/Order/Create.jsx
- resources/js/Pages/User/Product/Index.jsx
- resources/js/Pages/User/Product/Show.jsx
- resources/js/Pages/User/Transaction/Create.jsx
- resources/js/Pages/User/Transaction/Edit.jsx
- resources/js/Pages/User/Transaction/Form/TransactionForm.jsx
- resources/js/Pages/User/Transaction/Index.jsx
- resources/js/Pages/User/Transaction/Partials/TransactionSummary.jsx
- resources/js/Pages/User/Transaction/Show.jsx

SOURCE OF TRUTH RULES
1. The database schema defined in database/migrations is the ONLY source of truth.
2. Eloquent Models, Controllers, Services, and all Inertia React pages MUST strictly follow the migrations.
3. If a field, relationship, enum value, argument, prop, or UI element exists in code but NOT in migrations:
   - REMOVE it from:
     - Models (relationships, casts, fillable, accessors/mutators)
     - Controllers (queries, eager loads, validation rules, payloads)
     - React/Inertia pages (props usage, form fields, tables, detail views, modals)
     - Services (request payloads, mappings, integrations)
4. If a migration defines a field that is missing or incorrectly named in code, FIX the code to match the migration exactly.

MANDATORY CASE TO HANDLE
- If “product detail”, “product_details”, “packet detail”, or similar concepts do NOT exist in the products or orders migrations:
  - Completely remove all related relationships, logic, and UI:
    - resources/js/Pages/Admin/Product/Packet/*
    - Any form fields, modals, controllers, services, or queries that assume product detail data
  - Ensure the remaining Product and Order flows continue to work correctly without errors.

WORKFLOW (FOLLOW THIS ORDER)
A. Build a Schema Map from migrations:
   - For each table: columns (name, type, nullable, default), indexes, foreign keys
   - Derive ONLY valid relationships from foreign keys

B. Backend Audit:
   - Enums: values must align with what is stored and validated in DB
   - Models: fillable, guarded, casts, relationships must match the schema map
   - Controllers: validation rules, queries, filters, pagination, eager loading, and Inertia props must be correct
   - Services (Duitku): ensure order/payment payload mapping matches schema; remove invalid fields

C. Frontend Audit (Inertia React):
   - Ensure all props used by components are actually provided by controllers
   - Form fields must match migration columns (name, type, required/nullable)
   - Tables, detail views, and modals must not access non-existent relationships
   - Remove or refactor Packet/ProductDetail pages if not supported by schema

D. Fix & Refactor:
   - Apply minimal but correct changes
   - Remove unused imports and dead code
   - Ensure routes, links, and buttons do not point to removed features
   - Keep core CRUD flows functional: Blog, BlogCategory, Product, Order, Payment, Contact, Category

REQUIRED OUTPUT
1. Summary of all schema mismatches (grouped by table and by backend/frontend)
2. Per-file change list explaining what was removed/modified and WHY (referencing migrations)
3. Code patches or final code snippets ready to apply
4. List of routes/components that must be removed or redirected
5. Short manual testing checklist after applying the changes

CONSTRAINTS
- Do NOT modify migrations unless explicitly instructed.
- Do NOT infer schema from models or controllers—only from migrations.
- When in doubt, choose the safest option: remove unsupported relations/features and simplify the UI.

Start by reading migrations, building the schema map, then auditing backend code, then frontend code, and finally produce the output in the format above.
