export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          messages: Json | null
          metadata: Json | null
          resolved_at: string | null
          satisfaction_rating: number | null
          session_id: string
          status: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          messages?: Json | null
          metadata?: Json | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          session_id: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          messages?: Json | null
          metadata?: Json | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          session_id?: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_feedback: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          feedback_text: string | null
          id: string
          is_helpful: boolean | null
          message_index: number | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          is_helpful?: boolean | null
          message_index?: number | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          is_helpful?: boolean | null
          message_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_knowledge: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          priority: number | null
          source_url: string | null
          title: string
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          priority?: number | null
          source_url?: string | null
          title: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          priority?: number | null
          source_url?: string | null
          title?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      ai_settings: {
        Row: {
          avatar_url: string | null
          business_hours_end: string | null
          business_hours_only: boolean | null
          business_hours_start: string | null
          created_at: string | null
          id: string
          is_enabled: boolean | null
          max_tokens: number | null
          model: string | null
          system_prompt: string | null
          temperature: number | null
          updated_at: string | null
          welcome_message: string | null
          widget_color: string | null
          widget_position: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_hours_end?: string | null
          business_hours_only?: boolean | null
          business_hours_start?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          max_tokens?: number | null
          model?: string | null
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string | null
          welcome_message?: string | null
          widget_color?: string | null
          widget_position?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_hours_end?: string | null
          business_hours_only?: boolean | null
          business_hours_start?: string | null
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          max_tokens?: number | null
          model?: string | null
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string | null
          welcome_message?: string | null
          widget_color?: string | null
          widget_position?: string | null
        }
        Relationships: []
      }
      airlines: {
        Row: {
          country: string | null
          created_at: string | null
          iata_code: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name_ar: string
          name_en: string
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          iata_code?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name_ar: string
          name_en: string
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          iata_code?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name_ar?: string
          name_en?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      airports: {
        Row: {
          city_ar: string
          city_en: string
          country_ar: string
          country_code: string | null
          country_en: string
          created_at: string | null
          iata_code: string
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          timezone: string | null
        }
        Insert: {
          city_ar: string
          city_en: string
          country_ar: string
          country_code?: string | null
          country_en: string
          created_at?: string | null
          iata_code: string
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          timezone?: string | null
        }
        Update: {
          city_ar?: string
          city_en?: string
          country_ar?: string
          country_code?: string | null
          country_en?: string
          created_at?: string | null
          iata_code?: string
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          timezone?: string | null
        }
        Relationships: []
      }
      blog_articles: {
        Row: {
          author_name: string | null
          category: string | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          display_order: number | null
          excerpt: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          published_at: string | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      booking_passengers: {
        Row: {
          booking_id: string
          created_at: string | null
          date_of_birth: string
          first_name: string
          frequent_flyer_number: string | null
          gender: string
          id: string
          last_name: string
          meal_preference: string | null
          nationality: string | null
          passenger_type: string
          passport_country: string | null
          passport_expiry: string | null
          passport_number: string | null
          seat_number: string | null
          special_requests: string | null
          title: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          date_of_birth: string
          first_name: string
          frequent_flyer_number?: string | null
          gender?: string
          id?: string
          last_name: string
          meal_preference?: string | null
          nationality?: string | null
          passenger_type?: string
          passport_country?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          seat_number?: string | null
          special_requests?: string | null
          title?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          date_of_birth?: string
          first_name?: string
          frequent_flyer_number?: string | null
          gender?: string
          id?: string
          last_name?: string
          meal_preference?: string | null
          nationality?: string | null
          passenger_type?: string
          passport_country?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          seat_number?: string | null
          special_requests?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_passengers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "flight_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_payments: {
        Row: {
          amount: number
          booking_id: string
          card_brand: string | null
          card_last_four: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          error_message: string | null
          gateway_response: Json | null
          id: string
          installment_plan: Json | null
          payment_method: string
          refunded_at: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount?: number
          booking_id: string
          card_brand?: string | null
          card_last_four?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          error_message?: string | null
          gateway_response?: Json | null
          id?: string
          installment_plan?: Json | null
          payment_method?: string
          refunded_at?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          card_brand?: string | null
          card_last_four?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          error_message?: string | null
          gateway_response?: Json | null
          id?: string
          installment_plan?: Json | null
          payment_method?: string
          refunded_at?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "flight_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          adults_count: number
          agent_id: string | null
          booking_reference: string
          booking_type: string
          cancellation_reason: string | null
          cancelled_at: string | null
          check_in_date: string
          check_out_date: string
          children_count: number | null
          completed_at: string | null
          confirmed_at: string | null
          created_at: string | null
          currency: string | null
          discount_amount: number | null
          hotel_id: string | null
          id: string
          infants_count: number | null
          internal_notes: string | null
          payment_status: string | null
          points_earned: number | null
          points_redeemed: number | null
          points_value: number | null
          program_date_id: string | null
          program_id: string | null
          promo_code: string | null
          promo_discount: number | null
          room_id: string | null
          service_fee: number | null
          source: string | null
          special_requests: string | null
          status: string | null
          subtotal: number
          taxes: number | null
          total_amount: number
          total_nights: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adults_count?: number
          agent_id?: string | null
          booking_reference: string
          booking_type: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          check_in_date: string
          check_out_date: string
          children_count?: number | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          hotel_id?: string | null
          id?: string
          infants_count?: number | null
          internal_notes?: string | null
          payment_status?: string | null
          points_earned?: number | null
          points_redeemed?: number | null
          points_value?: number | null
          program_date_id?: string | null
          program_id?: string | null
          promo_code?: string | null
          promo_discount?: number | null
          room_id?: string | null
          service_fee?: number | null
          source?: string | null
          special_requests?: string | null
          status?: string | null
          subtotal: number
          taxes?: number | null
          total_amount: number
          total_nights?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adults_count?: number
          agent_id?: string | null
          booking_reference?: string
          booking_type?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          check_in_date?: string
          check_out_date?: string
          children_count?: number | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          hotel_id?: string | null
          id?: string
          infants_count?: number | null
          internal_notes?: string | null
          payment_status?: string | null
          points_earned?: number | null
          points_redeemed?: number | null
          points_value?: number | null
          program_date_id?: string | null
          program_id?: string | null
          promo_code?: string | null
          promo_discount?: number | null
          room_id?: string | null
          service_fee?: number | null
          source?: string | null
          special_requests?: string | null
          status?: string | null
          subtotal?: number
          taxes?: number | null
          total_amount?: number
          total_nights?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_program_date_id_fkey"
            columns: ["program_date_id"]
            isOneToOne: false
            referencedRelation: "program_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      car_rentals: {
        Row: {
          bags: number | null
          category: string | null
          city_ar: string
          city_en: string
          country_ar: string
          country_en: string
          created_at: string | null
          features: Json | null
          fuel_type: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name_ar: string
          name_en: string
          price_per_day: number
          price_with_driver: number | null
          rating: number | null
          seats: number | null
          transmission: string | null
          updated_at: string | null
        }
        Insert: {
          bags?: number | null
          category?: string | null
          city_ar?: string
          city_en?: string
          country_ar?: string
          country_en?: string
          created_at?: string | null
          features?: Json | null
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name_ar: string
          name_en: string
          price_per_day?: number
          price_with_driver?: number | null
          rating?: number | null
          seats?: number | null
          transmission?: string | null
          updated_at?: string | null
        }
        Update: {
          bags?: number | null
          category?: string | null
          city_ar?: string
          city_en?: string
          country_ar?: string
          country_en?: string
          created_at?: string | null
          features?: Json | null
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          price_per_day?: number
          price_with_driver?: number | null
          rating?: number | null
          seats?: number | null
          transmission?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          replied_at: string | null
          replied_by: string | null
          reply_message: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          reply_message?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          reply_message?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_replied_by_fkey"
            columns: ["replied_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          average_rating: number | null
          best_time_to_visit: string | null
          category: string[] | null
          country_ar: string
          country_en: string
          cover_image: string
          created_at: string | null
          created_by: string | null
          currency_code: string | null
          description_ar: string | null
          description_en: string | null
          display_order: number | null
          gallery: Json | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_trending: boolean | null
          language: string | null
          latitude: number | null
          longitude: number | null
          meta_description_ar: string | null
          meta_description_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          name_ar: string
          name_en: string
          price_currency: string | null
          region_ar: string | null
          region_en: string | null
          short_description_ar: string | null
          short_description_en: string | null
          slug: string
          starting_price: number | null
          tags: string[] | null
          timezone: string | null
          total_reviews: number | null
          updated_at: string | null
          video_url: string | null
          visa_instructions_ar: string | null
          visa_instructions_en: string | null
          visa_on_arrival: boolean | null
          visa_required: boolean | null
        }
        Insert: {
          average_rating?: number | null
          best_time_to_visit?: string | null
          category?: string[] | null
          country_ar: string
          country_en: string
          cover_image: string
          created_at?: string | null
          created_by?: string | null
          currency_code?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          gallery?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_trending?: boolean | null
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          name_ar: string
          name_en: string
          price_currency?: string | null
          region_ar?: string | null
          region_en?: string | null
          short_description_ar?: string | null
          short_description_en?: string | null
          slug: string
          starting_price?: number | null
          tags?: string[] | null
          timezone?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          video_url?: string | null
          visa_instructions_ar?: string | null
          visa_instructions_en?: string | null
          visa_on_arrival?: boolean | null
          visa_required?: boolean | null
        }
        Update: {
          average_rating?: number | null
          best_time_to_visit?: string | null
          category?: string[] | null
          country_ar?: string
          country_en?: string
          cover_image?: string
          created_at?: string | null
          created_by?: string | null
          currency_code?: string | null
          description_ar?: string | null
          description_en?: string | null
          display_order?: number | null
          gallery?: Json | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_trending?: boolean | null
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          name_ar?: string
          name_en?: string
          price_currency?: string | null
          region_ar?: string | null
          region_en?: string | null
          short_description_ar?: string | null
          short_description_en?: string | null
          slug?: string
          starting_price?: number | null
          tags?: string[] | null
          timezone?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          video_url?: string | null
          visa_instructions_ar?: string | null
          visa_instructions_en?: string | null
          visa_on_arrival?: boolean | null
          visa_required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "destinations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dynamic_packages: {
        Row: {
          adults_count: number | null
          car_rental_id: string | null
          check_in_date: string | null
          check_out_date: string | null
          children_count: number | null
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          destination: string | null
          destination_id: string | null
          extras: Json | null
          flight_offer_id: string | null
          hotel_id: string | null
          id: string
          infants_count: number | null
          notes: string | null
          room_id: string | null
          selected_activities: Json | null
          session_id: string | null
          status: string | null
          subtotal: number | null
          taxes: number | null
          total_price: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          adults_count?: number | null
          car_rental_id?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          children_count?: number | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          destination?: string | null
          destination_id?: string | null
          extras?: Json | null
          flight_offer_id?: string | null
          hotel_id?: string | null
          id?: string
          infants_count?: number | null
          notes?: string | null
          room_id?: string | null
          selected_activities?: Json | null
          session_id?: string | null
          status?: string | null
          subtotal?: number | null
          taxes?: number | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          adults_count?: number | null
          car_rental_id?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          children_count?: number | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          destination?: string | null
          destination_id?: string | null
          extras?: Json | null
          flight_offer_id?: string | null
          hotel_id?: string | null
          id?: string
          infants_count?: number | null
          notes?: string | null
          room_id?: string | null
          selected_activities?: Json | null
          session_id?: string | null
          status?: string | null
          subtotal?: number | null
          taxes?: number | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_packages_car_rental_id_fkey"
            columns: ["car_rental_id"]
            isOneToOne: false
            referencedRelation: "car_rentals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dynamic_packages_flight_offer_id_fkey"
            columns: ["flight_offer_id"]
            isOneToOne: false
            referencedRelation: "flight_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dynamic_packages_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dynamic_packages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hotel_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_bookings: {
        Row: {
          additional_services: Json | null
          admin_notes: string | null
          adults: number | null
          amadeus_order_id: string | null
          base_price: number
          cabin_class: string | null
          cancelled_at: string | null
          children: number | null
          confirmed_at: string | null
          contact_email: string
          contact_first_name: string
          contact_last_name: string
          contact_phone: string
          created_at: string | null
          currency: string | null
          departure_date: string
          destination_city: string | null
          destination_code: string
          flight_offer: Json
          id: string
          infants: number | null
          notes: string | null
          origin_city: string | null
          origin_code: string
          payment_status: string | null
          pnr: string
          return_date: string | null
          seat_selections: Json | null
          services_price: number | null
          status: string | null
          taxes: number | null
          ticket_numbers: string[] | null
          ticketed_at: string | null
          total_passengers: number
          total_price: number
          trip_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          additional_services?: Json | null
          admin_notes?: string | null
          adults?: number | null
          amadeus_order_id?: string | null
          base_price?: number
          cabin_class?: string | null
          cancelled_at?: string | null
          children?: number | null
          confirmed_at?: string | null
          contact_email: string
          contact_first_name: string
          contact_last_name: string
          contact_phone: string
          created_at?: string | null
          currency?: string | null
          departure_date: string
          destination_city?: string | null
          destination_code: string
          flight_offer?: Json
          id?: string
          infants?: number | null
          notes?: string | null
          origin_city?: string | null
          origin_code: string
          payment_status?: string | null
          pnr?: string
          return_date?: string | null
          seat_selections?: Json | null
          services_price?: number | null
          status?: string | null
          taxes?: number | null
          ticket_numbers?: string[] | null
          ticketed_at?: string | null
          total_passengers?: number
          total_price?: number
          trip_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          additional_services?: Json | null
          admin_notes?: string | null
          adults?: number | null
          amadeus_order_id?: string | null
          base_price?: number
          cabin_class?: string | null
          cancelled_at?: string | null
          children?: number | null
          confirmed_at?: string | null
          contact_email?: string
          contact_first_name?: string
          contact_last_name?: string
          contact_phone?: string
          created_at?: string | null
          currency?: string | null
          departure_date?: string
          destination_city?: string | null
          destination_code?: string
          flight_offer?: Json
          id?: string
          infants?: number | null
          notes?: string | null
          origin_city?: string | null
          origin_code?: string
          payment_status?: string | null
          pnr?: string
          return_date?: string | null
          seat_selections?: Json | null
          services_price?: number | null
          status?: string | null
          taxes?: number | null
          ticket_numbers?: string[] | null
          ticketed_at?: string | null
          total_passengers?: number
          total_price?: number
          trip_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      flight_offers: {
        Row: {
          airline_id: string | null
          arrival_time: string | null
          available_seats: number | null
          baggage_allowance: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          departure_date: string
          departure_time: string | null
          destination_airport_id: string | null
          duration_minutes: number | null
          external_id: string | null
          flight_class: string | null
          flight_number: string | null
          id: string
          is_active: boolean | null
          is_direct: boolean | null
          is_featured: boolean | null
          meal_included: boolean | null
          notes: string | null
          origin_airport_id: string | null
          original_price: number | null
          price_adult: number
          price_child: number | null
          price_infant: number | null
          return_date: string | null
          source: string | null
          stops_count: number | null
          total_seats: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          airline_id?: string | null
          arrival_time?: string | null
          available_seats?: number | null
          baggage_allowance?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          departure_date: string
          departure_time?: string | null
          destination_airport_id?: string | null
          duration_minutes?: number | null
          external_id?: string | null
          flight_class?: string | null
          flight_number?: string | null
          id?: string
          is_active?: boolean | null
          is_direct?: boolean | null
          is_featured?: boolean | null
          meal_included?: boolean | null
          notes?: string | null
          origin_airport_id?: string | null
          original_price?: number | null
          price_adult: number
          price_child?: number | null
          price_infant?: number | null
          return_date?: string | null
          source?: string | null
          stops_count?: number | null
          total_seats?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          airline_id?: string | null
          arrival_time?: string | null
          available_seats?: number | null
          baggage_allowance?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          departure_date?: string
          departure_time?: string | null
          destination_airport_id?: string | null
          duration_minutes?: number | null
          external_id?: string | null
          flight_class?: string | null
          flight_number?: string | null
          id?: string
          is_active?: boolean | null
          is_direct?: boolean | null
          is_featured?: boolean | null
          meal_included?: boolean | null
          notes?: string | null
          origin_airport_id?: string | null
          original_price?: number | null
          price_adult?: number
          price_child?: number | null
          price_infant?: number | null
          return_date?: string | null
          source?: string | null
          stops_count?: number | null
          total_seats?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flight_offers_airline_id_fkey"
            columns: ["airline_id"]
            isOneToOne: false
            referencedRelation: "airlines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_offers_destination_airport_id_fkey"
            columns: ["destination_airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_offers_origin_airport_id_fkey"
            columns: ["origin_airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_features: {
        Row: {
          bg_color: string | null
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          bg_color?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          bg_color?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_hero_slides: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          highlight: string
          id: string
          image: string | null
          is_active: boolean | null
          stats: Json | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          highlight?: string
          id?: string
          image?: string | null
          is_active?: boolean | null
          stats?: Json | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          highlight?: string
          id?: string
          image?: string | null
          is_active?: boolean | null
          stats?: Json | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value?: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      homepage_stats: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          label: string
          number: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          label: string
          number: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          label?: string
          number?: string
        }
        Relationships: []
      }
      homepage_testimonials: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          location: string | null
          name: string
          rating: number | null
          text: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          location?: string | null
          name: string
          rating?: number | null
          text: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          location?: string | null
          name?: string
          rating?: number | null
          text?: string
        }
        Relationships: []
      }
      honeymoon_features: {
        Row: {
          bg_color: string | null
          color: string | null
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          bg_color?: string | null
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          bg_color?: string | null
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      honeymoon_packages: {
        Row: {
          badge: string | null
          created_at: string | null
          description: string | null
          destination: string | null
          display_order: number | null
          duration: string | null
          emoji: string | null
          features: Json | null
          id: string
          image: string | null
          is_active: boolean | null
          old_price: number | null
          price: number | null
          rating: number | null
          reviews: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          description?: string | null
          destination?: string | null
          display_order?: number | null
          duration?: string | null
          emoji?: string | null
          features?: Json | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          old_price?: number | null
          price?: number | null
          rating?: number | null
          reviews?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          description?: string | null
          destination?: string | null
          display_order?: number | null
          duration?: string | null
          emoji?: string | null
          features?: Json | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          old_price?: number | null
          price?: number | null
          rating?: number | null
          reviews?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      honeymoon_testimonials: {
        Row: {
          created_at: string | null
          destination: string | null
          display_order: number | null
          id: string
          location: string | null
          name: string
          rating: number | null
          text: string
        }
        Insert: {
          created_at?: string | null
          destination?: string | null
          display_order?: number | null
          id?: string
          location?: string | null
          name: string
          rating?: number | null
          text: string
        }
        Update: {
          created_at?: string | null
          destination?: string | null
          display_order?: number | null
          id?: string
          location?: string | null
          name?: string
          rating?: number | null
          text?: string
        }
        Relationships: []
      }
      hotel_bookings: {
        Row: {
          adults_count: number | null
          booking_reference: string
          cancelled_at: string | null
          check_in_date: string
          check_out_date: string
          children_count: number | null
          confirmed_at: string | null
          created_at: string | null
          currency: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          discount: number | null
          fees: number | null
          guests: Json | null
          hotel_id: string | null
          id: string
          internal_notes: string | null
          nights_count: number
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          price_per_night: number
          room_id: string | null
          rooms_count: number | null
          special_requests: string | null
          status: string | null
          subtotal: number
          taxes: number | null
          total_price: number
          updated_at: string | null
        }
        Insert: {
          adults_count?: number | null
          booking_reference: string
          cancelled_at?: string | null
          check_in_date: string
          check_out_date: string
          children_count?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          discount?: number | null
          fees?: number | null
          guests?: Json | null
          hotel_id?: string | null
          id?: string
          internal_notes?: string | null
          nights_count: number
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          price_per_night: number
          room_id?: string | null
          rooms_count?: number | null
          special_requests?: string | null
          status?: string | null
          subtotal: number
          taxes?: number | null
          total_price: number
          updated_at?: string | null
        }
        Update: {
          adults_count?: number | null
          booking_reference?: string
          cancelled_at?: string | null
          check_in_date?: string
          check_out_date?: string
          children_count?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          discount?: number | null
          fees?: number | null
          guests?: Json | null
          hotel_id?: string | null
          id?: string
          internal_notes?: string | null
          nights_count?: number
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          price_per_night?: number
          room_id?: string | null
          rooms_count?: number | null
          special_requests?: string | null
          status?: string | null
          subtotal?: number
          taxes?: number | null
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hotel_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_rooms: {
        Row: {
          amenities: Json | null
          available_rooms: number | null
          bed_type: string | null
          created_at: string | null
          currency: string | null
          description_ar: string | null
          description_en: string | null
          hotel_id: string
          id: string
          images: Json | null
          includes_breakfast: boolean | null
          includes_wifi: boolean | null
          is_active: boolean | null
          max_adults: number | null
          max_children: number | null
          name_ar: string
          name_en: string
          original_price: number | null
          price_per_night: number
          room_size_sqm: number | null
          room_type: string | null
          total_rooms: number | null
          updated_at: string | null
        }
        Insert: {
          amenities?: Json | null
          available_rooms?: number | null
          bed_type?: string | null
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          hotel_id: string
          id?: string
          images?: Json | null
          includes_breakfast?: boolean | null
          includes_wifi?: boolean | null
          is_active?: boolean | null
          max_adults?: number | null
          max_children?: number | null
          name_ar: string
          name_en: string
          original_price?: number | null
          price_per_night: number
          room_size_sqm?: number | null
          room_type?: string | null
          total_rooms?: number | null
          updated_at?: string | null
        }
        Update: {
          amenities?: Json | null
          available_rooms?: number | null
          bed_type?: string | null
          created_at?: string | null
          currency?: string | null
          description_ar?: string | null
          description_en?: string | null
          hotel_id?: string
          id?: string
          images?: Json | null
          includes_breakfast?: boolean | null
          includes_wifi?: boolean | null
          is_active?: boolean | null
          max_adults?: number | null
          max_children?: number | null
          name_ar?: string
          name_en?: string
          original_price?: number | null
          price_per_night?: number
          room_size_sqm?: number | null
          room_type?: string | null
          total_rooms?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: string | null
          amenities: Json | null
          cancellation_policy: string | null
          check_in_time: string | null
          check_out_time: string | null
          city_ar: string
          city_en: string
          country_ar: string
          country_en: string
          created_at: string | null
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          email: string | null
          external_id: string | null
          gallery: Json | null
          hotel_type: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          main_image: string | null
          name_ar: string
          name_en: string
          phone: string | null
          rating: number | null
          reviews_count: number | null
          source: string | null
          star_rating: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          city_ar: string
          city_en: string
          country_ar: string
          country_en: string
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          email?: string | null
          external_id?: string | null
          gallery?: Json | null
          hotel_type?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          main_image?: string | null
          name_ar: string
          name_en: string
          phone?: string | null
          rating?: number | null
          reviews_count?: number | null
          source?: string | null
          star_rating?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          city_ar?: string
          city_en?: string
          country_ar?: string
          country_en?: string
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          email?: string | null
          external_id?: string | null
          gallery?: Json | null
          hotel_type?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          main_image?: string | null
          name_ar?: string
          name_en?: string
          phone?: string | null
          rating?: number | null
          reviews_count?: number | null
          source?: string | null
          star_rating?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_type: string | null
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message_ar: string
          message_en: string | null
          metadata: Json | null
          read_at: string | null
          title_ar: string
          title_en: string | null
          type: string
          user_id: string
        }
        Insert: {
          action_type?: string | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message_ar: string
          message_en?: string | null
          metadata?: Json | null
          read_at?: string | null
          title_ar: string
          title_en?: string | null
          type: string
          user_id: string
        }
        Update: {
          action_type?: string | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message_ar?: string
          message_en?: string | null
          metadata?: Json | null
          read_at?: string | null
          title_ar?: string
          title_en?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          card_brand: string | null
          card_last_four: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          failure_reason: string | null
          gateway: string | null
          gateway_response: Json | null
          id: string
          installment_plan: Json | null
          installments_count: number | null
          is_installment: boolean | null
          payment_method: string
          refund_amount: number | null
          refund_reason: string | null
          refunded_at: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_id: string
          card_brand?: string | null
          card_last_four?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          gateway?: string | null
          gateway_response?: Json | null
          id?: string
          installment_plan?: Json | null
          installments_count?: number | null
          is_installment?: boolean | null
          payment_method: string
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string
          card_brand?: string | null
          card_last_four?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          gateway?: string | null
          gateway_response?: Json | null
          id?: string
          installment_plan?: Json | null
          installments_count?: number | null
          is_installment?: boolean | null
          payment_method?: string
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      program_dates: {
        Row: {
          available_spots: number | null
          booked_spots: number | null
          created_at: string | null
          departure_date: string
          id: string
          price_note: string | null
          program_id: string
          return_date: string
          special_price: number | null
          status: string | null
          total_spots: number
        }
        Insert: {
          available_spots?: number | null
          booked_spots?: number | null
          created_at?: string | null
          departure_date: string
          id?: string
          price_note?: string | null
          program_id: string
          return_date: string
          special_price?: number | null
          status?: string | null
          total_spots?: number
        }
        Update: {
          available_spots?: number | null
          booked_spots?: number | null
          created_at?: string | null
          departure_date?: string
          id?: string
          price_note?: string | null
          program_id?: string
          return_date?: string
          special_price?: number | null
          status?: string | null
          total_spots?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_dates_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          average_rating: number | null
          base_price: number
          child_price: number | null
          countries: string[] | null
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description_ar: string | null
          description_en: string | null
          destination_id: string | null
          discount_percentage: number | null
          discount_valid_until: string | null
          display_order: number | null
          duration_days: number
          duration_nights: number
          excludes: Json | null
          gallery: Json | null
          highlights: string[] | null
          hotel_options: Json | null
          id: string
          includes: Json | null
          infant_price: number | null
          is_active: boolean | null
          is_featured: boolean | null
          itinerary: Json
          max_travelers: number | null
          min_travelers: number | null
          name_ar: string
          name_en: string
          original_price: number | null
          price_currency: string | null
          program_type: string
          single_supplement: number | null
          slug: string
          total_bookings: number | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          base_price: number
          child_price?: number | null
          countries?: string[] | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          destination_id?: string | null
          discount_percentage?: number | null
          discount_valid_until?: string | null
          display_order?: number | null
          duration_days: number
          duration_nights: number
          excludes?: Json | null
          gallery?: Json | null
          highlights?: string[] | null
          hotel_options?: Json | null
          id?: string
          includes?: Json | null
          infant_price?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json
          max_travelers?: number | null
          min_travelers?: number | null
          name_ar: string
          name_en: string
          original_price?: number | null
          price_currency?: string | null
          program_type: string
          single_supplement?: number | null
          slug: string
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          base_price?: number
          child_price?: number | null
          countries?: string[] | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description_ar?: string | null
          description_en?: string | null
          destination_id?: string | null
          discount_percentage?: number | null
          discount_valid_until?: string | null
          display_order?: number | null
          duration_days?: number
          duration_nights?: number
          excludes?: Json | null
          gallery?: Json | null
          highlights?: string[] | null
          hotel_options?: Json | null
          id?: string
          includes?: Json | null
          infant_price?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json
          max_travelers?: number | null
          min_travelers?: number | null
          name_ar?: string
          name_en?: string
          original_price?: number | null
          price_currency?: string | null
          program_type?: string
          single_supplement?: number | null
          slug?: string
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          applicable_to: string[] | null
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          destination_ids: string[] | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          is_public: boolean | null
          max_discount: number | null
          min_order_amount: number | null
          name_ar: string | null
          name_en: string | null
          program_ids: string[] | null
          usage_limit: number | null
          usage_per_user: number | null
          used_count: number | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          applicable_to?: string[] | null
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          destination_ids?: string[] | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_discount?: number | null
          min_order_amount?: number | null
          name_ar?: string | null
          name_en?: string | null
          program_ids?: string[] | null
          usage_limit?: number | null
          usage_per_user?: number | null
          used_count?: number | null
          valid_from: string
          valid_until: string
        }
        Update: {
          applicable_to?: string[] | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          destination_ids?: string[] | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_discount?: number | null
          min_order_amount?: number | null
          name_ar?: string | null
          name_en?: string | null
          program_ids?: string[] | null
          usage_limit?: number | null
          usage_per_user?: number | null
          used_count?: number | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          cons: string[] | null
          content: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          images: Json | null
          is_verified_purchase: boolean | null
          overall_rating: number
          pros: string[] | null
          ratings: Json | null
          responded_at: string | null
          responded_by: string | null
          response: string | null
          reviewable_id: string
          reviewable_type: string
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          cons?: string[] | null
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: Json | null
          is_verified_purchase?: boolean | null
          overall_rating: number
          pros?: string[] | null
          ratings?: Json | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          reviewable_id: string
          reviewable_type: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          cons?: string[] | null
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          images?: Json | null
          is_verified_purchase?: boolean | null
          overall_rating?: number
          pros?: string[] | null
          ratings?: Json | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          reviewable_id?: string
          reviewable_type?: string
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: Json | null
          base_price: number
          bed_type: string | null
          created_at: string | null
          extra_adult_price: number | null
          extra_child_price: number | null
          hotel_id: string
          id: string
          images: Json | null
          is_active: boolean | null
          max_adults: number | null
          max_children: number | null
          name_ar: string
          name_en: string
          room_size: number | null
          room_type: string
          total_rooms: number | null
          updated_at: string | null
          view_type: string | null
        }
        Insert: {
          amenities?: Json | null
          base_price: number
          bed_type?: string | null
          created_at?: string | null
          extra_adult_price?: number | null
          extra_child_price?: number | null
          hotel_id: string
          id?: string
          images?: Json | null
          is_active?: boolean | null
          max_adults?: number | null
          max_children?: number | null
          name_ar: string
          name_en: string
          room_size?: number | null
          room_type: string
          total_rooms?: number | null
          updated_at?: string | null
          view_type?: string | null
        }
        Update: {
          amenities?: Json | null
          base_price?: number
          bed_type?: string | null
          created_at?: string | null
          extra_adult_price?: number | null
          extra_child_price?: number | null
          hotel_id?: string
          id?: string
          images?: Json | null
          is_active?: boolean | null
          max_adults?: number | null
          max_children?: number | null
          name_ar?: string
          name_en?: string
          room_size?: number | null
          room_type?: string
          total_rooms?: number | null
          updated_at?: string | null
          view_type?: string | null
        }
        Relationships: []
      }
      seasonal_offers: {
        Row: {
          applicable_destinations: Json | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          min_booking_amount: number | null
          offer_type: string
          promo_code: string | null
          title_ar: string
          title_en: string
          usage_limit: number | null
          used_count: number | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          applicable_destinations?: Json | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_booking_amount?: number | null
          offer_type: string
          promo_code?: string | null
          title_ar: string
          title_en: string
          usage_limit?: number | null
          used_count?: number | null
          valid_from: string
          valid_until: string
        }
        Update: {
          applicable_destinations?: Json | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_booking_amount?: number | null
          offer_type?: string
          promo_code?: string | null
          title_ar?: string
          title_en?: string
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          emoji: string | null
          features: Json | null
          icon: string | null
          id: string
          is_active: boolean | null
          path: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          emoji?: string | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          path?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          emoji?: string | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          path?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      special_offers: {
        Row: {
          countries: Json | null
          cover_image: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          destination: string
          discount_percentage: number | null
          discounted_price: number
          display_order: number | null
          duration: string | null
          highlights: Json | null
          id: string
          includes: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          is_hot: boolean | null
          offer_type: string
          original_price: number
          slug: string
          terms: string | null
          title_ar: string
          title_en: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          countries?: Json | null
          cover_image?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          destination: string
          discount_percentage?: number | null
          discounted_price?: number
          display_order?: number | null
          duration?: string | null
          highlights?: Json | null
          id?: string
          includes?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_hot?: boolean | null
          offer_type?: string
          original_price?: number
          slug: string
          terms?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          countries?: Json | null
          cover_image?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          destination?: string
          discount_percentage?: number | null
          discounted_price?: number
          display_order?: number | null
          duration?: string | null
          highlights?: Json | null
          id?: string
          includes?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_hot?: boolean | null
          offer_type?: string
          original_price?: number
          slug?: string
          terms?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      tour_activities: {
        Row: {
          category: string | null
          city_ar: string
          city_en: string
          country_ar: string | null
          country_en: string | null
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          duration_hours: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name_ar: string
          name_en: string
          price_per_person: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          city_ar?: string
          city_en?: string
          country_ar?: string | null
          country_en?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name_ar: string
          name_en: string
          price_per_person?: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          city_ar?: string
          city_en?: string
          country_ar?: string | null
          country_en?: string | null
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          price_per_person?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tour_cities: {
        Row: {
          accommodation: string | null
          attractions: string[] | null
          average_temp: string | null
          best_time: string | null
          coordinates_lat: number | null
          coordinates_lng: number | null
          country_id: string
          created_at: string | null
          description: string | null
          display_order: number | null
          highlights: string[] | null
          id: string
          image: string | null
          is_active: boolean | null
          name_ar: string
          name_en: string
          updated_at: string | null
        }
        Insert: {
          accommodation?: string | null
          attractions?: string[] | null
          average_temp?: string | null
          best_time?: string | null
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          country_id: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          highlights?: string[] | null
          id: string
          image?: string | null
          is_active?: boolean | null
          name_ar: string
          name_en: string
          updated_at?: string | null
        }
        Update: {
          accommodation?: string | null
          attractions?: string[] | null
          average_temp?: string | null
          best_time?: string | null
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          country_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          highlights?: string[] | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "tour_countries"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_countries: {
        Row: {
          best_season: string | null
          budget: string | null
          climate: string | null
          coordinates_lat: number | null
          coordinates_lng: number | null
          cover_image: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          display_order: number | null
          flag_emoji: string | null
          highlights: string[] | null
          id: string
          is_active: boolean | null
          language: string | null
          name_ar: string
          name_en: string
          trip_duration: string | null
          updated_at: string | null
          visa: string | null
        }
        Insert: {
          best_season?: string | null
          budget?: string | null
          climate?: string | null
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          cover_image?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          flag_emoji?: string | null
          highlights?: string[] | null
          id: string
          is_active?: boolean | null
          language?: string | null
          name_ar: string
          name_en: string
          trip_duration?: string | null
          updated_at?: string | null
          visa?: string | null
        }
        Update: {
          best_season?: string | null
          budget?: string | null
          climate?: string | null
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          cover_image?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          display_order?: number | null
          flag_emoji?: string | null
          highlights?: string[] | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          name_ar?: string
          name_en?: string
          trip_duration?: string | null
          updated_at?: string | null
          visa?: string | null
        }
        Relationships: []
      }
      travelers: {
        Row: {
          booking_id: string
          created_at: string | null
          date_of_birth: string
          email: string | null
          first_name: string
          first_name_ar: string | null
          gender: string | null
          id: string
          is_lead_traveler: boolean | null
          last_name: string
          last_name_ar: string | null
          meal_preference: string | null
          nationality: string | null
          passport_country: string | null
          passport_expiry: string | null
          passport_number: string | null
          phone: string | null
          special_needs: string | null
          traveler_type: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          date_of_birth: string
          email?: string | null
          first_name: string
          first_name_ar?: string | null
          gender?: string | null
          id?: string
          is_lead_traveler?: boolean | null
          last_name: string
          last_name_ar?: string | null
          meal_preference?: string | null
          nationality?: string | null
          passport_country?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          special_needs?: string | null
          traveler_type: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          date_of_birth?: string
          email?: string | null
          first_name?: string
          first_name_ar?: string | null
          gender?: string | null
          id?: string
          is_lead_traveler?: boolean | null
          last_name?: string
          last_name_ar?: string | null
          meal_preference?: string | null
          nationality?: string | null
          passport_country?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          special_needs?: string | null
          traveler_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "travelers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          apple_id: string | null
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          email_verified: boolean | null
          first_name: string
          first_name_ar: string | null
          gender: string | null
          google_id: string | null
          id: string
          last_login_at: string | null
          last_name: string
          last_name_ar: string | null
          loyalty_points: number | null
          loyalty_tier: string | null
          nationality: string | null
          newsletter_subscribed: boolean | null
          passport_country: string | null
          passport_expiry: string | null
          passport_number: string | null
          password_hash: string | null
          phone: string | null
          phone_verified: boolean | null
          preferred_currency: string | null
          preferred_language: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          apple_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          email_verified?: boolean | null
          first_name: string
          first_name_ar?: string | null
          gender?: string | null
          google_id?: string | null
          id?: string
          last_login_at?: string | null
          last_name: string
          last_name_ar?: string | null
          loyalty_points?: number | null
          loyalty_tier?: string | null
          nationality?: string | null
          newsletter_subscribed?: boolean | null
          passport_country?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          password_hash?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          preferred_language?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          apple_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string
          first_name_ar?: string | null
          gender?: string | null
          google_id?: string | null
          id?: string
          last_login_at?: string | null
          last_name?: string
          last_name_ar?: string | null
          loyalty_points?: number | null
          loyalty_tier?: string | null
          nationality?: string | null
          newsletter_subscribed?: boolean | null
          passport_country?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          password_hash?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          preferred_language?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
