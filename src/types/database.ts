// マイグレーション適用後は以下のコマンドで自動生成した内容に置き換える:
// supabase gen types typescript --project-id <project-id> > src/types/database.ts
export type CompanyType = "client" | "partner" | "group";
export type CompanyRole = "owner" | "admin" | "member";
export type InvitationStatus = "pending" | "accepted" | "revoked";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          type: CompanyType;
          description: string | null;
          logo_url: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: CompanyType;
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
    };
    Views: Record<string, never>;
    Functions: {
      create_company: {
        Args: {
          company_name: string;
          company_type: CompanyType;
          company_description?: string | null;
        };
        Returns: Database["public"]["Tables"]["companies"]["Row"];
      };
      accept_invitation: {
        Args: { invitation_token: string };
        Returns: Database["public"]["Tables"]["company_members"]["Row"];
      };
    };
  };
};
