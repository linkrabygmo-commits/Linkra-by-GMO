// マイグレーション適用後は以下のコマンドで自動生成した内容に置き換える:
// supabase gen types typescript --project-id <project-id> > src/types/database.ts
export type CompanyType = "client" | "partner" | "group";
export type CompanyRole = "owner" | "admin" | "member";
export type InvitationStatus = "pending" | "accepted" | "revoked";
export type MemberStatus = "registered" | "approved" | "admin";
export type AdPlacement = "top_hero" | "sidebar" | "inline";
export type AdStatus = "pending" | "approved" | "rejected";
export type EventAudience = "member_only" | "public";
export type EventApplicationStatus = "pending" | "confirmed" | "cancelled";
export type AnnouncementStatus = "draft" | "published";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          title: string | null;
          member_status: MemberStatus;
          phone: string | null;
          address: string | null;
          sns_links: Record<string, string> | null;
          bio: string | null;
          can_offer: string | null;
          looking_for: string | null;
          industry: string | null;
          company_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          title?: string | null;
          member_status?: MemberStatus;
          phone?: string | null;
          address?: string | null;
          sns_links?: Record<string, string> | null;
          bio?: string | null;
          can_offer?: string | null;
          looking_for?: string | null;
          industry?: string | null;
          company_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          title?: string | null;
          member_status?: MemberStatus;
          phone?: string | null;
          address?: string | null;
          sns_links?: Record<string, string> | null;
          bio?: string | null;
          can_offer?: string | null;
          looking_for?: string | null;
          industry?: string | null;
          company_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          type: CompanyType | null;
          description: string | null;
          logo_url: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: CompanyType;
          description?: string | null;
          logo_url?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: CompanyType;
          description?: string | null;
          logo_url?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      company_members: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          role: CompanyRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id: string;
          role?: CompanyRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          user_id?: string;
          role?: CompanyRole;
          created_at?: string;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          company_id: string;
          email: string;
          role: CompanyRole;
          token: string;
          status: InvitationStatus;
          invited_by: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          email: string;
          role?: CompanyRole;
          token?: string;
          status?: InvitationStatus;
          invited_by: string;
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          email?: string;
          role?: CompanyRole;
          token?: string;
          status?: InvitationStatus;
          invited_by?: string;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      advertisements: {
        Row: {
          id: string;
          title: string | null;
          description: string | null;
          image_url: string | null;
          video_url: string | null;
          link_url: string;
          placement: AdPlacement;
          status: AdStatus;
          requested_by: string;
          approved_by: string | null;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          description?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          link_url: string;
          placement?: AdPlacement;
          status?: AdStatus;
          requested_by: string;
          approved_by?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          description?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          link_url?: string;
          placement?: AdPlacement;
          status?: AdStatus;
          requested_by?: string;
          approved_by?: string | null;
          starts_at?: string | null;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          audience: EventAudience;
          location: string | null;
          starts_at: string;
          ends_at: string | null;
          capacity: number | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          cover_image_url?: string | null;
          audience?: EventAudience;
          location?: string | null;
          starts_at: string;
          ends_at?: string | null;
          capacity?: number | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          cover_image_url?: string | null;
          audience?: EventAudience;
          location?: string | null;
          starts_at?: string;
          ends_at?: string | null;
          capacity?: number | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      member_event_applications: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: EventApplicationStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: EventApplicationStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: EventApplicationStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      guest_event_applications: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          phone: string | null;
          status: EventApplicationStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          phone?: string | null;
          status?: EventApplicationStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          status?: EventApplicationStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          body: string;
          cover_image_url: string | null;
          status: AnnouncementStatus;
          published_at: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          cover_image_url?: string | null;
          status?: AnnouncementStatus;
          published_at?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          cover_image_url?: string | null;
          status?: AnnouncementStatus;
          published_at?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      member_directory: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          company_name: string | null;
          title: string | null;
          industry: string | null;
          member_status: MemberStatus;
          created_at: string;
          phone: string | null;
          address: string | null;
          sns_links: Record<string, string> | null;
          bio: string | null;
          can_offer: string | null;
          looking_for: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_company: {
        Args: {
          company_name: string;
          company_type?: CompanyType;
          company_description?: string | null;
        };
        Returns: Database["public"]["Tables"]["companies"]["Row"];
      };
      current_member_status: {
        Args: Record<string, never>;
        Returns: MemberStatus;
      };
      approve_member: {
        Args: { target_id: string };
        Returns: Database["public"]["Tables"]["profiles"]["Row"];
      };
      set_member_status: {
        Args: { target_id: string; new_status: MemberStatus };
        Returns: Database["public"]["Tables"]["profiles"]["Row"];
      };
      delete_company: {
        Args: { target_id: string };
        Returns: undefined;
      };
    };
  };
};
