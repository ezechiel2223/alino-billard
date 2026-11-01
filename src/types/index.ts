export interface Settings {
  id: number;
  whatsapp_number: string;
  company_name: string;
  address: string;
  hero_title: string;
  hero_subtitle: string;
  contact_text: string;
  training_title: string;
  training_description: string;
  training_image: string;
  training_button_text: string;
  phone?: string;
  phone2?: string;
  hours?: string;
  logo_url?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number | null;
  category: string;
  image_url: string;
  available: boolean;
  badge?: string | null;
  created_at?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  price?: number | null;
  image_url: string;
  active: boolean;
  created_at?: string;
}

export interface VerticalPromotion {
  id: string;
  title: string;
  description: string;
  image_url: string;
  active: boolean;
  created_at?: string;
}

export const PRODUCT_CATEGORIES = [
  'Tables de billard',
  'Queues',
  'Accessoires',
  'Matériel professionnel',
  'Masters',
] as const;

export const DEFAULT_SETTINGS: Settings = {
  id: 1,
  whatsapp_number: '237681504830',
  company_name: 'Alino Billard Accessoires',
  address: 'Carrefour Jouvence, Yaoundé, Cameroun',
  hero_title: "L'univers du billard à votre portée",
  hero_subtitle:
    'Tables, queues, accessoires et équipements professionnels de billard. Découvrez nos produits et contactez-nous directement sur WhatsApp.',
  contact_text:
    "Une question, un projet ou une commande ? Contactez-nous directement sur WhatsApp, nous vous répondons rapidement.",
  training_title: 'Formation au billard',
  training_description:
    "Découvrez nos sessions de formation pour tous les niveaux : débutants, intermédiaires et joueurs confirmés. Apprenez les techniques, la stratégie et le contrôle de la queue avec nos instructeurs.",
  training_image: '',
  training_button_text: 'Demander une formation',
  phone: '+237 681 504 830',
  phone2: '+237 698 531 311',
  hours: 'Lun - Sam : 08h00 - 18h00',
  logo_url: '',
};
