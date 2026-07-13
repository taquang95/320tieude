import { FAQItem, HeadlineTemplate, BenefitCard, DocContentItem, TargetAudience } from "./types";

export const BENEFITS: BenefitCard[] = [
  {
    id: "benefit-1",
    title: "Lên content nhanh gấp 5 lần",
    description: "Không còn cảnh ngồi hàng giờ nhìn vào màn hình trống rỗng. Chỉ cần chọn mẫu tiêu đề, điền thông tin dự án của bạn và đăng bài ngay lập tức.",
    iconName: "Zap"
  },
  {
    id: "benefit-2",
    title: "Viết chuẩn xác insight khách hàng",
    description: "Các mẫu tiêu đề được nghiên cứu kỹ lưỡng dựa trên tâm lý học hành vi của khách mua BĐS, chạm đúng nỗi sợ, kỳ vọng và mong muốn của từng nhóm khách hàng.",
    iconName: "Target"
  },
  {
    id: "benefit-3",
    title: "Sử dụng thực chiến tức thì",
    description: "Cực kỳ dễ tùy biến. Công thức đã được đóng gói sẵn dưới dạng [Loại hình BĐS], [Nhóm khách hàng], [Khu vực]. Bạn chỉ cần thay thế các biến số là hoàn thành.",
    iconName: "CheckSquare"
  }
];

export const INSIDE_CONTENT: DocContentItem[] = [
  {
    id: "content-1",
    title: "Xu hướng & Động lực mua",
    description: "Kích thích sự tò mò và đón đầu xu thế thị trường BĐS hiện tại.",
    details: [
      "Tại sao nhóm khách gia đình đang rút tiền gửi để mua [Loại hình BĐS]?",
      "Xu hướng tìm kiếm không gian xanh của cư dân thành thị năm nay.",
      "Cách viết tiêu đề đánh vào tâm lý sợ bỏ lỡ cơ hội đầu tư tốt."
    ],
    badge: "Chương 1"
  },
  {
    id: "content-2",
    title: "Câu hỏi phản biện & Hướng dẫn",
    description: "Giải quyết sự nghi ngờ và định hướng tư duy ra quyết định của khách hàng.",
    details: [
      "Tiêu đề dạng so sánh trực quan: Nên mua căn hộ hay đất nền vùng ven?",
      "Đặt câu hỏi nhắm thẳng vào băn khoăn thầm kín của người mua nhà lần đầu.",
      "Hướng dẫn từng bước giúp khách hàng tự thẩm định giá trị dự án."
    ],
    badge: "Chương 2"
  },
  {
    id: "content-3",
    title: "Top list & Checklist ngắn gọn",
    description: "Dạng nội dung có tỷ lệ click và chia sẻ cao nhất trên mạng xã hội.",
    details: [
      "Top [Số] tiêu chí lựa chọn dự án an toàn pháp lý tuyệt đối.",
      "Checklist 5 điều phải làm trước khi xuống cọc giữ chỗ.",
      "Tổng hợp những khu vực tiềm năng tăng giá mạnh nhất trong 6 tháng tới."
    ],
    badge: "Chương 3"
  },
  {
    id: "content-4",
    title: "Sai lầm, cảnh báo & Sự thật",
    description: "Đánh trúng nỗi sợ hãi mất tiền của khách hàng để tạo độ tin cậy cực cao.",
    details: [
      "Sai lầm kinh điển khiến 90% nhà đầu tư F0 mất trắng tiền cọc.",
      "Cảnh báo: Đừng vội mua [Loại hình BĐS] nếu chưa kiểm tra điều khoản này.",
      "Sự thật trần trụi về những cam kết lợi nhuận khủng của chủ đầu tư."
    ],
    badge: "Chương 4"
  },
  {
    id: "content-5",
    title: "Tài chính, pháp lý & Quy hoạch",
    description: "Khẳng định chuyên môn sâu rộng và xây dựng lòng tin tuyệt đối.",
    details: [
      "Làm thế nào để vay ngân hàng mua nhà mà không bị áp lực trả nợ áp đảo?",
      "Cách đọc bản đồ quy hoạch chi tiết 1/500 để tránh dính quy hoạch lộ giới.",
      "Giải mã các loại sổ đỏ, sổ hồng và hợp đồng mua bán pháp lý."
    ],
    badge: "Chương 5"
  },
  {
    id: "content-6",
    title: "Chuyên biệt theo loại hình",
    description: "Bao phủ toàn bộ các phân khúc từ bình dân, trung lưu đến cao cấp.",
    details: [
      "Công thức viết tiêu đề dành riêng cho Căn hộ chung cư, Officetel.",
      "Tối ưu nội dung bán Đất nền, Nhà phố liền kề, Shophouse kinh doanh.",
      "Khai thác phân khúc cao cấp: Biệt thự nghỉ dưỡng, BĐS ven biển."
    ],
    badge: "Chương 6"
  }
];

export const HEADLINE_TEMPLATES: HeadlineTemplate[] = [
  {
    id: "tpl-1",
    template: "Xu hướng {loaiHinh} mới nổi mà {nhomKhach} tại {khuVuc} đang đặc biệt quan tâm",
    category: "Xu hướng"
  },
  {
    id: "tpl-2",
    template: "Làm sao để sở hữu {loaiHinh} an toàn tại {khuVuc} mà không lo rủi ro pháp lý?",
    category: "Hướng dẫn"
  },
  {
    id: "tpl-3",
    template: "Top 5 lý do vì sao {nhomKhach} nên xuống tiền mua {loaiHinh} tại {khuVuc} ngay trong tháng này",
    category: "Top list"
  },
  {
    id: "tpl-4",
    template: "Sai lầm đắt giá khi mua {loaiHinh} tại {khuVuc} mà {nhomKhach} cần tuyệt đối tránh",
    category: "Cảnh báo"
  }
];

export const FILTER_OPTIONS = {
  loaiHinh: [
    { value: "căn hộ chung cư cao cấp", label: "🏢 Căn hộ chung cư" },
    { value: "đất nền sổ đỏ thổ cư", label: "🗺️ Đất nền sổ đỏ" },
    { value: "nhà phố liền kề", label: "🏡 Nhà phố liền kề" },
    { value: "biệt thự ven biển nghỉ dưỡng", label: "🏝️ Biệt thự nghỉ dưỡng" }
  ],
  nhomKhach: [
    { value: "vợ chồng trẻ mua nhà lần đầu", label: "💑 Vợ chồng trẻ" },
    { value: "nhà đầu tư F0 nhiều vốn rảnh rỗi", label: "📈 Nhà đầu tư F0" },
    { value: "người mua ở thực cần sự an tâm", label: "👨‍👩‍👧‍👦 Người mua ở thực" },
    { value: "nhà đầu tư săn đất nền vùng ven", label: "🦅 Nhà đầu tư lướt sóng" }
  ],
  khuVuc: [
    { value: "Hà Nội", label: "📍 Hà Nội" },
    { value: "TP. Hồ Chí Minh", label: "📍 TP. HCM" },
    { value: "vùng ven đô đang phát triển", label: "📍 Vùng ven đô" },
    { value: "Bình Dương & Đồng Nai", label: "📍 Bình Dương & ĐN" }
  ]
};

export const TARGET_AUDIENCE_DATA: TargetAudience[] = [
  {
    id: "aud-1",
    title: "Môi giới Bất động sản",
    role: "Freelancer / Sales tại sàn",
    description: "Cần liên tục tạo ra content mới trên Facebook, Zalo, TikTok để tìm kiếm khách hàng tiềm năng và xây dựng thương hiệu cá nhân đáng tin cậy.",
    painPoint: "Hàng ngày phải suy nghĩ viết caption gì, đăng bài gì để không bị trôi và thu hút lượt tương tác thực tế.",
    benefit: "Sở hữu ngay kho tiêu đề khổng lồ, đăng cả năm không hết bài, chạm đúng tâm lý khách có tiền mua đất, mua nhà."
  },
  {
    id: "aud-2",
    title: "Content Marketer BĐS",
    role: "In-house Marketer / Agency",
    description: "Chịu trách nhiệm vận hành Fanpage dự án, viết bài quảng cáo chạy Ads cho các chiến dịch ra mắt phân khu mới.",
    painPoint: "Chạy Ads bị đắt, chi phí lead tăng cao do tiêu đề quảng cáo quá nhàm chán, thiếu tính giật gân thu hút.",
    benefit: "Tối ưu hóa ngay lập tức tỷ lệ Click-Through-Rate (CTR) nhờ các mẫu tiêu đề kích thích tò mò và đánh trực diện vào lợi ích."
  },
  {
    id: "aud-3",
    title: "Sales Leader & Chủ dự án",
    role: "Quản lý nhóm / CEO sàn nhỏ",
    description: "Cần cung cấp tài liệu đào tạo thực chiến và định hướng cách làm marketing online tinh gọn cho đội ngũ nhân sự bên dưới.",
    painPoint: "Đội ngũ nhân viên mới không biết cách tiếp cận khách hàng trên kênh online, viết bài lộn xộn, thiếu chuyên nghiệp.",
    benefit: "Có sẵn bộ khung quy chuẩn, dễ dàng chuyển giao cho đội ngũ cấp dưới tự áp dụng để đồng bộ chất lượng truyền thông."
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Tài liệu này có thực sự miễn phí không?",
    answer: "Có, tài liệu này hoàn toàn miễn phí 100%. Đây là món quà từ Nguyễn Nam Academy nhằm hỗ trợ cộng đồng môi giới và marketer BĐS nâng cao kỹ năng content marketing thực chiến. Chúng tôi cam kết không thu bất kỳ khoản phí nào khi bạn đăng ký tải bộ tài liệu này."
  },
  {
    id: "faq-2",
    question: "Tôi sẽ nhận file bằng cách nào?",
    answer: "Sau khi bạn nhập đúng địa chỉ email và nhấn nút đăng ký, hệ thống tự động của Nguyễn Nam Academy sẽ gửi trực tiếp đường link tải file PDF chất lượng cao vào hòm thư của bạn trong vòng 1-3 phút. Vui lòng kiểm tra kỹ cả hộp thư Quảng cáo (Promotions) hoặc Thư rác (Spam) nếu không thấy ở hộp thư chính."
  },
  {
    id: "faq-3",
    question: "Tài liệu này phù hợp với ai và áp dụng được cho dự án nào?",
    answer: "Tài liệu này được thiết kế dành riêng cho môi giới tự do, nhân viên marketing tại các sàn giao dịch và các chủ doanh nghiệp BĐS vừa và nhỏ. Các mẫu công thức tiêu đề có tính linh hoạt cực cao, có thể áp dụng thành công cho mọi phân khúc từ căn hộ chung cư, đất nền vùng ven, nhà phố nội đô cho đến biệt thự nghỉ dưỡng cao cấp."
  }
];
