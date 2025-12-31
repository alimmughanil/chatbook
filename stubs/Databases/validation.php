<?php

return [

    //================================================
    // Informasi Pengguna & Otentikasi
    //================================================
    'name'              => 'string|max:255',
    'first_name'        => 'string|max:100',
    'last_name'         => 'string|max:100',
    'username'          => 'string|alpha_dash|max:100|unique:{{ tableName }},username',
    'email'             => 'string|email|max:255|unique:{{ tableName }},email',
    'password'          => 'string|min:8|confirmed',
    'current_password'  => 'string|current_password',
    'phone'             => 'string|max:20',
    'mobile'            => 'string|max:20',
    'date_of_birth'     => 'date|before:today',
    'gender'            => 'string|in:male,female,other',
    'role'              => 'string',
    'remember_token'    => 'string',
    'email_verified_at' => 'date',


    //================================================
    // Konten & SEO
    //================================================
    'title'             => 'string|max:255',
    'subtitle'          => 'string|max:255',
    'slug'              => 'string|alpha_dash|max:255|unique:{{ tableName }},slug',
    'description'       => 'string',
    'excerpt'           => 'string|max:500', 
    'content'           => 'string',
    'body'              => 'string',
    'seo_title'        => 'string|max:255',
    'seo_description'  => 'string|max:160', 
    'seo_keyword'      => 'string',
    'tags'              => 'string', 
    'author'            => 'string|max:255',


    //================================================
    // E-commerce & Produk
    //================================================
    'sku'               => 'string|max:100|unique:products,sku', 
    'price'             => 'numeric|min:0',
    'sale_price'        => 'numeric|min:0|lte:price', 
    'stock'             => 'integer|min:0',
    'quantity'          => 'integer|min:1',
    'weight'            => 'numeric|min:0', 
    'width'             => 'numeric|min:0',
    'height'            => 'numeric|min:0',
    'length'            => 'numeric|min:0',
    'discount'          => 'numeric|min:0|max:100', 


    //================================================
    // Lokasi & Alamat
    //================================================
    'address'           => 'string|max:255',
    'address_line_1'    => 'string|max:255',
    'address_line_2'    => 'string|max:255',
    'city'              => 'string|max:100',
    'state'             => 'string|max:100', 
    'country'           => 'string|max:100',
    'postal_code'       => 'string|max:10', 
    'zip_code'          => 'string|max:10',
    'latitude'          => 'numeric|between:-90,90',
    'longitude'         => 'numeric|between:-180,180',


    //================================================
    // File & Media
    //================================================
    'image'             => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
    'avatar'            => 'image|mimes:jpeg,png,jpg|max:1024',
    'thumbnail'         => 'image|mimes:jpeg,png,jpg,webp|max:1024',
    'banner'            => 'image|mimes:jpeg,png,jpg,webp|max:4096',
    'file'              => 'file|mimes:pdf,doc,docx,xls,xlsx|max:5120',
    'video'             => 'file|mimetypes:video/avi,video/mpeg,video/mp4|max:20480',


    //================================================
    // Relasi & Kunci Asing (Foreign Keys)
    //================================================
    'user_id'           => 'integer|exists:users,id',
    'category_id'       => 'integer|exists:categories,id',
    'product_id'        => 'integer|exists:products,id',
    'tag_id'            => 'integer|exists:tags,id',
    'parent_id'         => 'integer|exists:{{ tableName }},id',
    'country_id'        => 'integer|exists:countries,id',
    'city_id'           => 'integer|exists:cities,id',


    //================================================
    // Data Umum & Sistem
    //================================================
    'status'            => 'string',
    'type'              => 'string',
    'is_active'         => 'boolean',
    'is_featured'       => 'boolean',
    'is_published'      => 'boolean',
    'ip_address'        => 'ip',
    'user_agent'        => 'string',
    'uuid'              => 'uuid',
    'token'             => 'string',
    'url'               => 'url',
    'link'              => 'url',
    'website'           => 'url',
    'sort_order'        => 'integer|min:0',
    'order'             => 'integer|min:0',
    'position'          => 'integer|min:0',
    'notes'             => 'string',
    'comment'           => 'string|max:2000',
    'rating'            => 'integer|min:1|max:5',
    'color'             => 'string|max:7', 
    'icon'              => 'string|max:50',
    'data'              => 'json', 


    //================================g================
    // Tanggal & Waktu
    //================================================
    'start_date'        => 'date',
    'end_date'          => 'date|after_or_equal:start_date',
    'start_at'          => 'date_format:Y-m-d H:i:s',
    'finish_at'         => 'date_format:Y-m-d H:i:s|after_or_equal:start_at',
    'published_at'      => 'date',
    'expired_at'        => 'date|after:today',
    'created_at'        => 'date',
    'updated_at'        => 'date',
    'deleted_at'        => 'date',

    
    //================================================
    // Default Fallback
    //================================================
    '_default'          => 'string',
];