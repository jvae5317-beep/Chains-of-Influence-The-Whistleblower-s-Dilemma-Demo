-- Create game save states table for cloud saves
CREATE TABLE public.game_saves (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slot_number INTEGER NOT NULL DEFAULT 1,
    save_name TEXT NOT NULL DEFAULT 'New Game',
    current_scene TEXT NOT NULL DEFAULT 'intro',
    choices_made JSONB NOT NULL DEFAULT '[]'::jsonb,
    faction_reputation JSONB NOT NULL DEFAULT '{"administrators": 0, "bloodlines": 0, "fixers": 0, "reformists": 0}'::jsonb,
    favor_debts JSONB NOT NULL DEFAULT '{"owed_to_player": [], "owed_by_player": []}'::jsonb,
    resources JSONB NOT NULL DEFAULT '{"influence": 50, "exposure": 10, "morality": 50}'::jsonb,
    unlocked_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    game_flags JSONB NOT NULL DEFAULT '{}'::jsonb,
    playtime_seconds INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, slot_number)
);

-- Create profiles table for user display info
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for game_saves - users can only access their own saves
CREATE POLICY "Users can view their own saves"
ON public.game_saves FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saves"
ON public.game_saves FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saves"
ON public.game_saves FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves"
ON public.game_saves FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for profiles
CREATE POLICY "Profiles are viewable by owner"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_game_saves_updated_at
BEFORE UPDATE ON public.game_saves
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
    RETURN NEW;
END;
$$;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();