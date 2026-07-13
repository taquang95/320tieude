export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface HeadlineTemplate {
  id: string;
  template: string; // e.g. "Xu hướng {loaiHinh} mới nổi mà {nhomKhach} tại {khuVuc} đang quan tâm"
  category: string;
}

export interface BenefitCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface DocContentItem {
  id: string;
  title: string;
  description: string;
  details: string[];
  badge: string;
}

export interface TargetAudience {
  id: string;
  title: string;
  role: string;
  description: string;
  painPoint: string;
  benefit: string;
}
