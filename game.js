/**
 * ============================================================================
 * ĐẠI CHIẾN BẮN CUNG CHIBI - GAME ENGINE VÀ LOGIC CHÍNH
 * NÂNG CẤP TOÀN DIỆN MỚI:
 * 1. Cơ chế Nhảy 2 lần (Double Jump): Nhấn nhảy 2 lần liên tục để bật cao vượt trội,
 *    có hiệu ứng vòng sóng xung kích dưới chân khi kích hoạt cú nhảy thứ 2.
 * 2. Tái cấu trúc 3 Bản đồ hoàn toàn mới: Thiết kế độ cao các bậc thang chuẩn xác,
 *    bậc thấp (y=530), bậc trung (y=430), bậc cao (y=320), thạch trụ cản tên hợp lý.
 * 3. Hiệu ứng gục ngã (Defeat Animation): Khi bất kỳ Bot hay đối thủ nào bị hạ gục,
 *    nhân vật sẽ ngã nghiêng xuống sàn, hiệu ứng hồn ma chibi bay lên, tan biến dần
 *    trong ánh hào quang bụi ma thuật sau đó biến mất khỏi trận địa.
 * 4. Hiệu ứng đồ họa chân thật & sắc nét: Bóng đổ mềm (Drop Shadow), ánh sáng Neon,
 *    hào quang nguyên tố, vệt khói và tia điện chân thực.
 * ============================================================================
 */

// ============================================================================
// 1. DATA ĐỊNH NGHĨA TRANG BỊ & NGUYÊN TỐ (WEAPONS & ARMOR DATA)
// ============================================================================

const WEAPONS = [
  // Cấp A
  {
    id: 'bow_a_basic',
    name: 'Cung Săn Gỗ Rừng',
    tier: 'A',
    element: 'none',
    baseDamage: 120,
    speedMultiplier: 1.0,
    special: 'none',
    desc: 'Cung cơ bản cấp A. Khung gỗ dẻo dai, bắn ổn định không mang nguyên tố. Sát thương cơ bản: 120 HP.'
  },
  {
    id: 'bow_a_poison',
    name: 'Cung Cốt Xà Huyết Độc',
    tier: 'A',
    element: 'poison',
    baseDamage: 110,
    speedMultiplier: 1.0,
    special: 'none',
    desc: 'Cấp A - Hệ Độc: Nọc độc tím bung khí độc trừ máu liên tục. Sát thương: 110 HP + Độc.'
  },

  // Cấp S
  {
    id: 'bow_s_fire',
    name: 'Cung Liệt Hỏa Dung Nham',
    tier: 'S',
    element: 'fire',
    baseDamage: 180,
    speedMultiplier: 1.15,
    special: 'none',
    desc: 'Cấp S - Hệ Lửa: Bùng lên biển lửa thiêu đốt đối thủ. Sát thương: 180 HP + Đốt cháy liên tục.'
  },
  {
    id: 'bow_s_water',
    name: 'Cung Thủy Tinh Hải Lưu',
    tier: 'S',
    element: 'water',
    baseDamage: 165,
    speedMultiplier: 1.1,
    special: 'none',
    desc: 'Cấp S - Hệ Nước: Xoáy ngầm làm chậm tốc độ di chuyển 3s. Sát thương: 165 HP + Làm chậm.'
  },
  {
    id: 'bow_s_lightning',
    name: 'Cung Lôi Quang Điện Triệt',
    tier: 'S',
    element: 'lightning',
    baseDamage: 190,
    speedMultiplier: 1.25,
    special: 'none',
    desc: 'Cấp S - Hệ Điện: Phóng tia sét giật choáng 1s khi trúng đích. Sát thương: 190 HP + Choáng.'
  },

  // Cấp SS
  {
    id: 'bow_ss_ice',
    name: 'Cung Băng Phách Hàn Băng',
    tier: 'SS',
    element: 'ice',
    baseDamage: 260,
    speedMultiplier: 1.3,
    special: 'none',
    desc: 'Cấp SS - Hệ Băng: Khối băng sắc lạnh đóng băng ngắt hành động 1.5s. Sát thương: 260 HP.'
  },
  {
    id: 'bow_ss_wood',
    name: 'Cung Mộc Linh Dây Leo Sống',
    tier: 'SS',
    element: 'wood',
    baseDamage: 240,
    speedMultiplier: 1.2,
    special: 'none',
    desc: 'Cấp SS - Hệ Mộc: Bụi gai hút máu hồi phục HP cho xạ thủ. Sát thương: 240 HP + Hút máu.'
  },
  {
    id: 'bow_ss_wind',
    name: 'Cung Thanh Phong Vũ Dực',
    tier: 'SS',
    element: 'wind',
    baseDamage: 280,
    speedMultiplier: 1.85,
    special: 'wind_pierce',
    desc: 'Cấp SS - Cung Vũ Dực: Bắn trúng treo lơ lửng, tạo lốc hất tung đối thủ, bay siêu tốc triệt tiêu gió. Sát thương: 280 HP.'
  },

  // Cấp SSS - Vũ khí thần thoại kèm kỹ năng đặc biệt
  {
    id: 'bow_sss_split',
    name: 'Thần Cung Tam Lôi Phân Thân',
    tier: 'SSS',
    element: 'lightning',
    baseDamage: 350,
    speedMultiplier: 1.45,
    special: 'split_arrow',
    desc: 'Cấp SSS - Phân Thân: Tách làm 3 mũi tên sấm sét khi đang bay, chạm đất sinh điện giật. Sát thương: 350 HP.'
  },
  {
    id: 'bow_sss_boomerang',
    name: 'Ngân Nguyệt Hồi Toàn Boomerang',
    tier: 'SSS',
    element: 'fire',
    baseDamage: 330,
    speedMultiplier: 1.35,
    special: 'boomerang',
    desc: 'Cấp SSS - Boomerang: Tự bám đuôi đối thủ 0.2s đầu rồi quay ngược lại gây sát thương 2 lượt và để lại biển lửa. Sát thương: 330 HP.'
  },
  {
    id: 'bow_sss_explosive',
    name: 'Bá Vương Hỏa Pháo Steampunk',
    tier: 'SSS',
    element: 'explosion',
    baseDamage: 400,
    speedMultiplier: 1.4,
    special: 'none',
    desc: 'Cấp SSS - Hệ Nổ: Pháo cơ khí steampunk tạo vụ nổ cực lớn lan rộng và khói bụi. Sát thương: 400 HP.'
  }
];

const ARMORS = {
  helmet: [
    { id: 'helm_none', name: 'Không Mũ', tier: 'D', defPercent: 0 },
    { id: 'helm_a', name: 'Mũ Da Thợ Săn (A)', tier: 'A', defPercent: 15 },
    { id: 'helm_s', name: 'Mũ Sắt Chiến Binh (S)', tier: 'S', defPercent: 30 },
    { id: 'helm_ss', name: 'Mũ Titan Hộ Mệnh (SS)', tier: 'SS', defPercent: 45 },
    { id: 'helm_sss', name: 'Vương Miện Thần Thánh (SSS)', tier: 'SSS', defPercent: 65 }
  ],
  chest: [
    { id: 'chest_none', name: 'Không Áo Giáp', tier: 'D', defPercent: 0 },
    { id: 'chest_a', name: 'Áo Vải Bện Thô (A)', tier: 'A', defPercent: 15 },
    { id: 'chest_s', name: 'Giáp Xích Bọc Thép (S)', tier: 'S', defPercent: 30 },
    { id: 'chest_ss', name: 'Hộ Tâm Kính Bạch Kim (SS)', tier: 'SS', defPercent: 45 },
    { id: 'chest_sss', name: 'Long Lân Chiến Giáp (SSS)', tier: 'SSS', defPercent: 65 }
  ],
  boots: [
    { id: 'boots_none', name: 'Không Giày/Găng', tier: 'D', defPercent: 0 },
    { id: 'boots_a', name: 'Ủng Da Báo (A)', tier: 'A', defPercent: 15 },
    { id: 'boots_s', name: 'Găng Hợp Kim Bền (S)', tier: 'S', defPercent: 30 },
    { id: 'boots_ss', name: 'Chiến Hài Phong Thần (SS)', tier: 'SS', defPercent: 45 },
    { id: 'boots_sss', name: 'Vũ Thần Hộ Thể (SSS)', tier: 'SSS', defPercent: 65 }
  ]
};

// ============================================================================
// 2. DATA 3 BẢN ĐỒ THI ĐẤU (THIẾT KẾ CẤU TRÚC PHÙ HỢP CHIỀU CAO NHẢY & NHẢY X2)
// Sàn đất y=620. Nhảy 1 lần: lên bục y=520 (cao 100px). Nhảy x2: lên bục y=410, y=300
// ============================================================================

const MAP_CONFIGS = {
  jungle: {
    id: 'jungle',
    name: 'Thung Lũng Cổ Thụ',
    skyColors: ['#1e3799', '#38ada9', '#b8e994'],
    mountainColor1: '#079992',
    mountainColor2: '#38ada9',
    groundColor: '#1e272e',
    groundTopColor: '#2ed573',
    flowerColor: '#ff4757',
    pits: [],
    spawns: [
      { x: 135, y: 520, facing: true },
      { x: 1145, y: 520, facing: false },
      { x: 640, y: 250, facing: true },
      { x: 140, y: 390, facing: true },
      { x: 1140, y: 390, facing: false }
    ],
    platforms: [
      // 2 Tháp quan sát ở 2 bên biên, để trống 800px thung lũng ở giữa cho đường bay tên cực xa
      { x: 50, y: 520, width: 170, height: 16, type: 'platform', style: 'moss_wood' },
      { x: 80, y: 390, width: 120, height: 14, type: 'platform', style: 'moss_wood' },

      { x: 1060, y: 520, width: 170, height: 16, type: 'platform', style: 'moss_wood' },
      { x: 1080, y: 390, width: 120, height: 14, type: 'platform', style: 'moss_wood' },

      // Cành đại thụ lơ lửng trên cao ở trung tâm
      { x: 550, y: 250, width: 180, height: 14, type: 'platform', style: 'moss_wood' }
    ]
  },
  volcano: {
    id: 'volcano',
    name: 'Vực Sâu Dung Nham',
    skyColors: ['#1e272e', '#c0392b', '#e67e22'],
    mountainColor1: '#2c3e50',
    mountainColor2: '#962d3e',
    groundColor: '#1e272e',
    groundTopColor: '#e74c3c',
    flowerColor: '#f39c12',
    pits: [],
    spawns: [
      { x: 155, y: 530, facing: true },
      { x: 1125, y: 530, facing: false },
      { x: 640, y: 330, facing: true },
      { x: 350, y: 440, facing: true },
      { x: 925, y: 440, facing: false }
    ],
    platforms: [
      // Quần đảo đá bazan nổi so le ziczac bậc thang vòm cung mở, hoàn toàn thông thoáng tầm mắt
      { x: 80, y: 530, width: 150, height: 16, type: 'platform', style: 'basalt' },
      { x: 290, y: 440, width: 130, height: 14, type: 'platform', style: 'basalt' },
      { x: 565, y: 330, width: 150, height: 14, type: 'platform', style: 'basalt' },
      { x: 860, y: 440, width: 130, height: 14, type: 'platform', style: 'basalt' },
      { x: 1050, y: 530, width: 150, height: 16, type: 'platform', style: 'basalt' }
    ]
  },
  icecave: {
    id: 'icecave',
    name: 'Đồi Tuyết Vô Tận',
    skyColors: ['#0c2461', '#1e3799', '#82ccdd'],
    mountainColor1: '#60a3bc',
    mountainColor2: '#4a69bd',
    groundColor: '#0a3d62',
    groundTopColor: '#78e08f',
    flowerColor: '#dff9fb',
    pits: [],
    spawns: [
      { x: 145, y: 480, facing: true },
      { x: 1130, y: 490, facing: false },
      { x: 510, y: 410, facing: true },
      { x: 800, y: 410, facing: false },
      { x: 145, y: 320, facing: true }
    ],
    platforms: [
      // Bờ vách băng bất đối xứng: sườn dốc cao phía Tây và các tảng băng trôi lơ lửng giữa trời
      { x: 50, y: 480, width: 190, height: 16, type: 'platform', style: 'ice_shelf' },
      { x: 80, y: 320, width: 130, height: 14, type: 'platform', style: 'ice_shelf' },
      { x: 450, y: 410, width: 120, height: 14, type: 'platform', style: 'ice_shelf' },
      { x: 740, y: 410, width: 120, height: 14, type: 'platform', style: 'ice_shelf' },
      { x: 1030, y: 490, width: 200, height: 16, type: 'platform', style: 'ice_shelf' }
    ]
  }
};

// ============================================================================
// 3. WEB AUDIO SYNTHESIZER
// ============================================================================

class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBowCharge(percent) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180 + percent * 260, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch(e) {}
  }

  playJump(isDouble = false) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isDouble ? 'square' : 'sine';
      osc.frequency.setValueAtTime(isDouble ? 340 : 220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isDouble ? 680 : 440, this.ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(isDouble ? 0.2 : 0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    } catch(e) {}
  }

  playShoot(element) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = element === 'lightning' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(element === 'lightning' ? 880 : 600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch(e) {}
  }

  playHit(hitbox) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = hitbox === 'head' ? 'triangle' : 'square';
      const baseFreq = hitbox === 'head' ? 900 : (hitbox === 'body' ? 360 : 200);
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch(e) {}
  }

  playObstacleHit() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch(e) {}
  }

  playExplosion() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch(e) {}
  }

  playHeal() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch(e) {}
  }

  playDefeatSound() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch(e) {}
  }

  playPitFall() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.7);
    } catch(e) {}
  }

  playNoEnergy() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch(e) {}
  }

  playEnergyPickup() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, this.ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch(e) {}
  }

  playVictory() {
    if (!this.enabled || !this.ctx) return;
    try {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const start = this.ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch(e) {}
  }
}

const sounds = new SoundManager();

// ============================================================================
// 4. VÙNG HIỆU ỨNG LAN (AOE ZONE CLASS)
// ============================================================================

class AoEZone {
  constructor(x, y, element, owner) {
    this.x = x;
    this.y = y;
    this.element = element;
    this.owner = owner;
    this.radius = 48;
    this.life = 3.6;
    this.maxLife = 3.6;
    this.tickTimer = 0;
    this.spawnVFX();
  }

  spawnVFX() {
    if (this.element === 'explosion') {
      sounds.playExplosion();
      for (let i = 0; i < 35; i++) {
        game.particles.push(new Particle(this.x, this.y, (Math.random()-0.5)*260, (Math.random()-0.5)*260, '#ff4757', 6, 0.6, 'spark'));
      }
    }
  }

  update(dt) {
    this.life -= dt;
    this.tickTimer += dt;

    if (Math.random() < 0.45) {
      const rx = this.x + (Math.random() - 0.5) * this.radius * 1.6;
      const ry = this.y - Math.random() * 20;

      switch (this.element) {
        case 'wood':
          game.particles.push(new Particle(rx, ry, (Math.random()-0.5)*20, -30, '#26de81', 4, 0.5, 'leaf'));
          break;
        case 'lightning':
          game.particles.push(new Particle(rx, ry, (Math.random()-0.5)*40, (Math.random()-0.5)*40, '#ffd32a', 3, 0.25, 'spark'));
          break;
        case 'fire':
          game.particles.push(new Particle(rx, ry, (Math.random()-0.5)*30, -40, '#ff4757', 4, 0.4, 'circle'));
          break;
        case 'poison':
          game.particles.push(new Particle(rx, ry, (Math.random()-0.5)*25, -20, '#a55eea', 7, 0.6, 'smoke'));
          break;
        case 'water':
          game.particles.push(new Particle(rx, ry, (Math.random()-0.5)*35, -15, '#1e90ff', 3, 0.4, 'circle'));
          break;
        case 'ice':
          game.particles.push(new Particle(rx, ry, (Math.random()-0.5)*20, -10, '#70a1ff', 3.5, 0.5, 'spark'));
          break;
        case 'wind':
          game.particles.push(new Particle(rx, ry, (Math.random()-0.5)*50, -45, '#ffffff', 3, 0.3, 'circle'));
          break;
        case 'explosion':
          game.particles.push(new Particle(rx, ry, (Math.random()-0.5)*30, -30, '#57606f', 5, 0.5, 'smoke'));
          break;
      }
    }

    // Nếu là lốc xoáy hệ Gió: Kiểm tra tức thì khi có đối thủ đạp trúng vùng hiệu ứng mở rộng -> hất bay lên như 1 lần nhảy
    if (this.element === 'wind') {
      const victims = (game.players || []).filter(p => p && p.id !== this.owner && !p.isDead && p.defeatState === 'ALIVE');

      victims.forEach(v => {
        const distX = Math.abs(v.x - this.x);
        const distY = Math.abs(v.y - this.y);
        // Đạp trúng hoặc đi vào vùng lốc xoáy
        if (distX <= this.radius + 10 && distY <= 38) {
          if (!v.windBounceCooldown || v.windBounceCooldown <= 0) {
            v.windBounceCooldown = 0.45;
            v.vy = v.jumpForce; // Hất tung lên trời với đúng lực của 1 lần nhảy (-470 px/s)
            v.isGrounded = false;
            sounds.playJump(false);

            game.particles.push(new Particle(v.x, v.y, 0, 0, '#00d2d3', 1, 0.4, 'shockwave'));
            for (let i = 0; i < 8; i++) {
              game.particles.push(new Particle(v.x, v.y, (Math.random()-0.5)*70, -60 - Math.random()*40, '#00d2d3', 3.5, 0.4, 'circle'));
            }
            game.floatingTexts.push(new FloatingText(v.x, v.y - 45, '🌪️ HẤT TUNG!', '#00d2d3', 17, true));
          }
        }
      });
    }

    if (this.tickTimer >= 0.5) {
      this.tickTimer = 0;
      this.checkVictims();
    }
  }

  checkVictims() {
    const victims = (game.players || []).filter(p => p && p.id !== this.owner && !p.isDead && p.defeatState === 'ALIVE');

    victims.forEach(v => {
      const dist = Math.hypot(v.x - this.x, (v.y - v.height / 2) - this.y);
      if (dist <= this.radius + 15) {
        const aoeDmg = 35;
        v.hp = Math.max(0, v.hp - aoeDmg);

        if (this.element === 'water') v.statusEffects.slow = 2.0;
        if (this.element === 'poison') v.statusEffects.poison = 3.0;
        if (this.element === 'fire') v.statusEffects.burn = 3.0;
        if (this.element === 'ice') v.statusEffects.freeze = 1.0;
        if (this.element === 'lightning') v.statusEffects.stun = 0.6;

        if (this.element === 'wood') {
          const shooter = game.getCharacterById(this.owner);
          if (shooter) shooter.heal(30);
        }

        const shooter = game.getCharacterById(this.owner);
        if (shooter) {
          shooter.totalDamageDealt += aoeDmg;
        }

        game.floatingTexts.push(new FloatingText(v.x, v.y - 65, `-${aoeDmg}`, '#ff9f43', 15));
        if (v.hp <= 0) {
          v.triggerDefeat();
        }
      }
    });
  }

  draw(ctx) {
    ctx.save();
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = alpha * 0.85;

    if (this.element === 'wood') {
      ctx.fillStyle = '#26de81';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10ac84';
      ctx.lineWidth = 3;
      for (let i = -30; i <= 30; i += 12) {
        ctx.beginPath();
        ctx.moveTo(this.x + i, this.y);
        ctx.lineTo(this.x + i + 4, this.y - 18);
        ctx.stroke();
      }
    } else if (this.element === 'lightning') {
      ctx.fillStyle = 'rgba(254, 202, 87, 0.4)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffd32a';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (this.element === 'fire') {
      const grad = ctx.createRadialGradient(this.x, this.y, 4, this.x, this.y, this.radius);
      grad.addColorStop(0, '#ff4757');
      grad.addColorStop(0.6, '#ffa502');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.element === 'ice') {
      ctx.fillStyle = 'rgba(112, 161, 255, 0.5)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dff9fb';
      ctx.strokeStyle = '#70a1ff';
      ctx.lineWidth = 1.5;
      for (let i = -24; i <= 24; i += 16) {
        ctx.beginPath();
        ctx.moveTo(this.x + i - 8, this.y);
        ctx.lineTo(this.x + i, this.y - 28);
        ctx.lineTo(this.x + i + 8, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (this.element === 'poison') {
      const grad = ctx.createRadialGradient(this.x, this.y, 6, this.x, this.y, this.radius);
      grad.addColorStop(0, '#8e44ad');
      grad.addColorStop(0.7, '#a55eea');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y - 8, this.radius, 22, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.element === 'water') {
      ctx.fillStyle = 'rgba(30, 144, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#48dbfb';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (this.element === 'wind') {
      const now = Date.now() / 120;
      ctx.lineWidth = 2.2;
      for (let i = 0; i < 3; i++) {
        const ringY = this.y - 6 - i * 11;
        const ringRx = this.radius * (0.45 + i * 0.24);
        const ringRy = 5 + i * 2;
        const rot = (now * (i % 2 === 0 ? 1 : -1) + i) % (Math.PI * 2);

        ctx.strokeStyle = i === 2 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 210, 211, 0.75)';
        ctx.beginPath();
        ctx.ellipse(this.x, ringY, ringRx, ringRy, rot * 0.2, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0, 210, 211, 0.16)';
      ctx.beginPath();
      ctx.moveTo(this.x - 12, this.y);
      ctx.quadraticCurveTo(this.x - 28, this.y - 18, this.x - this.radius, this.y - 32);
      ctx.lineTo(this.x + this.radius, this.y - 32);
      ctx.quadraticCurveTo(this.x + 28, this.y - 18, this.x + 12, this.y);
      ctx.closePath();
      ctx.fill();
    } else if (this.element === 'explosion') {
      ctx.fillStyle = 'rgba(47, 53, 66, 0.6)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// ============================================================================
// 5. HIỆU ỨNG HẠT CHÂN THẬT (PARTICLES, SHOCKWAVES & LIGHTNING)
// ============================================================================

class Particle {
  constructor(x, y, vx, vy, color, size, life, type = 'circle') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.type = type; // 'circle', 'leaf', 'spark', 'smoke', 'shockwave', 'ghost', 'ice', 'bubble', 'cinder', 'poison_drip', 'wind_slash'
    this.angle = Math.random() * Math.PI * 2;
    this.vAngle = (Math.random() - 0.5) * 6;
    this.gravity = 0;
    this.friction = 1.0;
    this.glow = false;
    this.glowColor = color;
  }

  update(dt) {
    if (this.gravity) this.vy += this.gravity * dt;
    if (this.friction && this.friction !== 1.0) {
      const f = Math.pow(this.friction, dt * 60);
      this.vx *= f;
      this.vy *= f;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.angle += this.vAngle * dt;
    this.life -= dt;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.glow) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.glowColor || this.color;
    }

    if (this.type === 'shockwave') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      const rX = (1 - alpha) * (this.size * 14) + 8;
      const rY = (1 - alpha) * (this.size * 6) + 3;
      ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.type === 'ice') {
      // Tinh thể băng sắc lạnh, hình thoi đa giác phát quang tuyết trắng
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#70a1ff';
      const s = this.size;
      ctx.beginPath();
      ctx.moveTo(0, -s * 1.6);
      ctx.lineTo(s * 0.9, 0);
      ctx.lineTo(0, s * 1.6);
      ctx.lineTo(-s * 0.9, 0);
      ctx.closePath();
      ctx.fill();

      // Tâm lõi tuyết trắng sáng
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'wind_slash') {
      // Lưỡi dao gió hình vòng cung mờ cuốn theo
      ctx.strokeStyle = this.color || 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      const radius = this.size * 4 * (1.8 - alpha * 0.8);
      ctx.arc(0, 0, radius, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();
    } else if (this.type === 'bubble') {
      // Bong bóng nước trong vắt lấp lánh phản quang
      const r = this.size * 1.2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.fillStyle = 'rgba(72, 219, 251, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Điểm bóng sáng trắng
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.35, r * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'cinder') {
      // Hạt tàn tro/lửa chớp nháy bốc lên cao
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff4757';
      const flick = 0.8 + Math.sin(Date.now() / 80 + this.x) * 0.2;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * flick, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'poison_drip') {
      // Giọt độc uốn lượn rơi xuống
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#a55eea';
      const s = this.size;
      ctx.beginPath();
      ctx.arc(0, s * 0.5, s, 0, Math.PI);
      ctx.lineTo(0, -s * 1.4);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'ghost') {
      // Hồn ma chibi bay lên khi gục ngã
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-10, 0); ctx.lineTo(-4, 14); ctx.lineTo(0, 8); ctx.lineTo(4, 14); ctx.lineTo(10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#2f3542';
      ctx.beginPath();
      ctx.arc(-3, -2, 2, 0, Math.PI * 2);
      ctx.arc(3, -2, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'leaf') {
      // Lá cây ngọc lục bảo xoay tròn
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#10ac84';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 1.8, this.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10ac84';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-this.size * 1.7, 0);
      ctx.lineTo(this.size * 1.7, 0);
      ctx.stroke();
    } else if (this.type === 'spark') {
      // Tia lửa phát quang kéo dài theo hướng bay
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fillRect(-this.size * 1.8, -this.size * 0.6, this.size * 3.6, this.size * 1.2);
    } else if (this.type === 'smoke') {
      // Đám khói xám xịt hoặc khí độc lan tỏa mềm mại
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * (1.8 - alpha * 0.6), 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

class LightningBolt {
  constructor(x1, y1, x2, y2, color = '#ffd32a', segments = 6) {
    this.points = [{ x: x1, y: y1 }];
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;
    for (let i = 1; i < segments; i++) {
      this.points.push({
        x: x1 + dx * i + (Math.random() - 0.5) * 35,
        y: y1 + dy * i + (Math.random() - 0.5) * 35
      });
    }
    this.points.push({ x: x2, y: y2 });
    this.life = 0.16;
    this.maxLife = 0.16;
    this.color = color;
  }

  update(dt) {
    this.life -= dt;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

class FloatingText {
  constructor(x, y, text, color, fontSize = 20, isCritical = false) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
    this.isCritical = isCritical;
    this.life = 1.2;
    this.vy = -50;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.life -= dt;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, this.life * 1.5);
    ctx.font = `bold ${this.fontSize}px 'Fredoka One', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText(this.text, this.x + 2, this.y + 2);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// ============================================================================
// 6. MŨI TÊN (ARROW CLASS)
// ============================================================================

class Arrow {
  constructor(owner, x, y, angle, power, weapon) {
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.angle = angle;
    this.power = power;
    this.weapon = weapon;

    // Cài đặt lại lực bắn: nếu bấm nút space và thả liền (power <= 3) -> tên rơi tại chỗ!
    let speed;
    if (power <= 3) {
      speed = Math.max(12, power * 5); // Tốc độ chỉ 12-15 px/s -> rơi cắm xuống đất ngay tại chỗ dưới chân
    } else if (power < 15) {
      speed = (25 + (power - 3) * 12) * weapon.speedMultiplier;
    } else {
      const norm = (power - 15) / 85;
      speed = (170 + norm * 850) * weapon.speedMultiplier;
    }
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.active = true;
    this.isBoomerang = weapon.special === 'boomerang';
    this.splitDone = false;
    this.flightTime = 0;
    this.trailTimer = 0;
  }

  update(dt, windX, gravity) {
    if (!this.active) return;
    this.flightTime += dt;
    this.prevX = this.x;
    this.prevY = this.y;

    let effectiveWind = windX;
    if (this.weapon.element === 'wind' || this.weapon.special === 'wind_pierce') {
      effectiveWind = 0;
    }

    if (this.weapon.special === 'split_arrow' && !this.splitDone && this.flightTime > 0.22) {
      this.splitDone = true;
      this.triggerSplit();
    }

    // KỸ NĂNG CUNG BOOMERANG: Tự động theo dõi kẻ địch gần nhất trong 0.2 giây đầu sau khi bắn
    if (this.isBoomerang && this.flightTime <= 0.2) {
      let nearestTarget = null;
      let minDist = Infinity;
      const targets = (game.players || []).filter(p => p && p.id !== this.owner && !p.isDead && p.defeatState === 'ALIVE');

      for (let t of targets) {
        if (t && !t.isDead) {
          const d = Math.hypot(t.x - this.x, (t.y - t.height * 0.5) - this.y);
          if (d < minDist) {
            minDist = d;
            nearestTarget = t;
          }
        }
      }

      if (nearestTarget) {
        const targetX = nearestTarget.x;
        const targetY = nearestTarget.y - nearestTarget.height * 0.5;
        const desiredAngle = Math.atan2(targetY - this.y, targetX - this.x);
        const currentSpeed = Math.hypot(this.vx, this.vy);

        let angleDiff = desiredAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        const steerRate = 8.5; // Tốc độ bẻ lái bám đuôi mục tiêu (rad/s)
        const step = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), steerRate * dt);
        this.angle += step;

        this.vx = Math.cos(this.angle) * currentSpeed;
        this.vy = Math.sin(this.angle) * currentSpeed;

        if (Math.random() < 0.45) {
          game.particles.push(new Particle(this.x, this.y, (Math.random()-0.5)*30, (Math.random()-0.5)*30, '#ffd32a', 3, 0.25, 'spark'));
        }
      }
    }

    if (this.isBoomerang && this.flightTime > 0.6) {
      const reverseDir = this.owner === 'p1' ? -950 : 950;
      this.vx += reverseDir * dt;
      this.vy += Math.sin(this.flightTime * 6) * 70 * dt;
    }

    this.vx += effectiveWind * dt;
    this.vy += gravity * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.angle = Math.atan2(this.vy, this.vx);

    this.trailTimer += dt;
    if (this.trailTimer > 0.02) {
      this.trailTimer = 0;
      this.createElementalTrail();
    }
  }

  createElementalTrail() {
    const el = this.weapon.element;
    const backX = this.x - Math.cos(this.angle) * 16;
    const backY = this.y - Math.sin(this.angle) * 16;

    if (el === 'lightning') {
      // Hệ Điện: Luồng điện zích zắc ngẫu nhiên và hạt tia lửa văng ra
      game.particles.push(new Particle(backX, backY, (Math.random()-0.5)*90, (Math.random()-0.5)*90, '#ffd32a', 3, 0.22, 'spark'));
      if (Math.random() < 0.45) {
        const offsetAng = (Math.random() - 0.5) * Math.PI;
        const arcLen = 20 + Math.random() * 25;
        const targetX = backX + Math.cos(this.angle + offsetAng) * arcLen;
        const targetY = backY + Math.sin(this.angle + offsetAng) * arcLen;
        game.lightnings.push(new LightningBolt(backX, backY, targetX, targetY, '#fff200', 3));
      }
    } else if (el === 'wood') {
      // Hệ Mộc: Vệt sáng li ti rơi rụng như lá cây
      if (Math.random() < 0.6) {
        const leafP = new Particle(backX, backY, -this.vx * 0.08 + (Math.random()-0.5)*30, 25 + Math.random()*25, '#2ed573', 4.5, 0.7, 'leaf');
        leafP.gravity = 50;
        game.particles.push(leafP);
      }
      const speck = new Particle(backX, backY, (Math.random()-0.5)*20, (Math.random()-0.5)*20, '#55efc4', 2, 0.4, 'spark');
      speck.glow = true;
      speck.glowColor = '#2ed573';
      game.particles.push(speck);
    } else if (el === 'fire') {
      // Hệ Lửa: Quả cầu lửa xé gió, đuôi rực sáng
      for (let i = 0; i < 2; i++) {
        const flameP = new Particle(backX, backY, (Math.random()-0.5)*25 - this.vx * 0.08, -35 + Math.random()*-20, i === 0 ? '#fffa65' : '#ff4757', 3.5 + Math.random()*3, 0.4, 'circle');
        flameP.gravity = -50;
        flameP.glow = true;
        flameP.glowColor = '#ff4757';
        game.particles.push(flameP);
      }
      if (Math.random() < 0.4) {
        const cinder = new Particle(backX, backY, (Math.random()-0.5)*30, -20, '#ffa502', 2, 0.5, 'cinder');
        game.particles.push(cinder);
      }
    } else if (el === 'ice') {
      // Hệ Băng: Vệt sương mù trắng và tinh thể tuyết
      const mist = new Particle(backX, backY, (Math.random()-0.5)*15, (Math.random()-0.5)*15, 'rgba(255,255,255,0.7)', 4, 0.4, 'smoke');
      game.particles.push(mist);
      if (Math.random() < 0.5) {
        const snow = new Particle(backX, backY, (Math.random()-0.5)*25, 20 + Math.random()*20, '#dff9fb', 3, 0.55, 'ice');
        snow.gravity = 60;
        game.particles.push(snow);
      }
    } else if (el === 'water') {
      // Hệ Nước: Dải lụa nước mờ ảo và bong bóng nhỏ bay lên
      const silk = new Particle(backX, backY, -this.vx * 0.06, (Math.random()-0.5)*15, 'rgba(0, 210, 211, 0.65)', 4, 0.35, 'circle');
      game.particles.push(silk);
      if (Math.random() < 0.5) {
        const bub = new Particle(backX, backY, (Math.random()-0.5)*20, -35 - Math.random()*20, '#ffffff', 2.5 + Math.random()*2, 0.6, 'bubble');
        bub.gravity = -40;
        game.particles.push(bub);
      }
    } else if (el === 'poison') {
      // Hệ Độc: Vệt khí độc uốn lượn và giọt độc rơi xuống
      const fume = new Particle(backX, backY, (Math.random()-0.5)*20, (Math.random()-0.5)*20, 'rgba(142, 68, 173, 0.75)', 5, 0.5, 'smoke');
      game.particles.push(fume);
      if (Math.random() < 0.35) {
        const drip = new Particle(backX, backY, (Math.random()-0.5)*15, 30 + Math.random()*25, '#2ed573', 2.5, 0.45, 'poison_drip');
        drip.gravity = 90;
        game.particles.push(drip);
      }
    } else if (el === 'explosion') {
      // Hệ Nổ: Vệt khói xám xịt và tàn tro bay lơ lửng phía sau
      const smokeP = new Particle(backX, backY, (Math.random()-0.5)*25, (Math.random()-0.5)*25, 'rgba(47, 53, 66, 0.7)', 5.5, 0.55, 'smoke');
      game.particles.push(smokeP);
      if (Math.random() < 0.5) {
        const ember = new Particle(backX, backY, (Math.random()-0.5)*35, -20 - Math.random()*25, '#ff793f', 2.5, 0.5, 'cinder');
        ember.gravity = -25;
        game.particles.push(ember);
      }
    } else if (el === 'wind') {
      // Hệ Gió: Các đường cắt gió (vòng cung mờ) cuốn theo
      if (Math.random() < 0.6) {
        const slash = new Particle(backX, backY, -this.vx * 0.12, (Math.random()-0.5)*15, 'rgba(255, 255, 255, 0.85)', 3, 0.3, 'wind_slash');
        game.particles.push(slash);
      }
    }
  }

  triggerSplit() {
    const angles = [this.angle - 0.22, this.angle + 0.22];
    angles.forEach(ang => {
      const child = new Arrow(this.owner, this.x, this.y, ang, this.power * 0.9, {
        ...this.weapon,
        special: 'none'
      });
      child.flightTime = 0.23;
      child.splitDone = true;
      game.arrows.push(child);
    });

    for (let i = 0; i < 15; i++) {
      game.particles.push(new Particle(this.x, this.y, (Math.random()-0.5)*180, (Math.random()-0.5)*180, '#ffd32a', 4, 0.4, 'spark'));
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const el = this.weapon.element;
    const glow = this.getGlowColor();

    // 1. Thân mũi tên (Shaft): LinearGradient kim loại thanh thoát bóng bẩy
    const shaftGrad = ctx.createLinearGradient(-26, 0, 16, 0);
    shaftGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    shaftGrad.addColorStop(0.5, glow);
    shaftGrad.addColorStop(1, '#ffffff');

    ctx.strokeStyle = shaftGrad;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-24, 0);
    ctx.lineTo(14, 0);
    ctx.stroke();

    // 2. Cánh đuôi mũi tên (Fletching): Tinh gọn khí động học
    ctx.fillStyle = glow;
    ctx.shadowBlur = 8;
    ctx.shadowColor = glow;
    ctx.beginPath();
    ctx.moveTo(-24, 0);
    ctx.lineTo(-30, -5.5);
    ctx.lineTo(-26, 0);
    ctx.lineTo(-30, 5.5);
    ctx.closePath();
    ctx.fill();

    // 3. Đầu mũi tên (Arrowhead): Thiết kế riêng biệt theo từng hệ nguyên tố với Glow & Gradient
    ctx.shadowBlur = 18;
    ctx.shadowColor = glow;

    if (el === 'fire') {
      // Hệ Lửa: Quả cầu lửa xé gió (RadialGradient bốc cháy)
      const fireGrad = ctx.createRadialGradient(16, 0, 1, 16, 0, 9);
      fireGrad.addColorStop(0, '#ffffff');
      fireGrad.addColorStop(0.4, '#fffa65');
      fireGrad.addColorStop(0.8, '#ff4757');
      fireGrad.addColorStop(1, 'rgba(255, 71, 87, 0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(16, 0, 9, 0, Math.PI * 2);
      ctx.fill();

      // Lưỡi lửa nhọn phía trước
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(25, 0);
      ctx.lineTo(13, -5);
      ctx.lineTo(15, 0);
      ctx.lineTo(13, 5);
      ctx.closePath();
      ctx.fill();
    } else if (el === 'ice') {
      // Hệ Băng: Mũi tinh thể băng xanh lam nhạt, sắc cạnh, tỏa sương
      const iceGrad = ctx.createLinearGradient(12, 0, 24, 0);
      iceGrad.addColorStop(0, '#70a1ff');
      iceGrad.addColorStop(0.6, '#dff9fb');
      iceGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = iceGrad;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(12, -7);
      ctx.lineTo(15, 0);
      ctx.lineTo(12, 7);
      ctx.closePath();
      ctx.fill();
    } else if (el === 'lightning') {
      // Hệ Điện: Mũi tên chớp giật vàng chanh chói lòa
      ctx.fillStyle = Math.random() < 0.5 ? '#ffffff' : '#ffd32a';
      ctx.beginPath();
      ctx.moveTo(25, 0);
      ctx.lineTo(14, -6);
      ctx.lineTo(18, 0);
      ctx.lineTo(14, 6);
      ctx.closePath();
      ctx.fill();
    } else if (el === 'water') {
      // Hệ Nước: Mũi nước hình giọt lệ bóng bẩy
      const waterGrad = ctx.createRadialGradient(18, -1, 1, 18, 0, 8);
      waterGrad.addColorStop(0, '#ffffff');
      waterGrad.addColorStop(0.5, '#48dbfb');
      waterGrad.addColorStop(1, '#0984e3');
      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.moveTo(23, 0);
      ctx.quadraticCurveTo(14, -7, 12, 0);
      ctx.quadraticCurveTo(14, 7, 23, 0);
      ctx.fill();
    } else if (el === 'wood') {
      // Hệ Mộc: Mũi gai ngọc lục bảo phát sáng xanh
      const woodGrad = ctx.createLinearGradient(12, 0, 24, 0);
      woodGrad.addColorStop(0, '#10ac84');
      woodGrad.addColorStop(0.7, '#2ed573');
      woodGrad.addColorStop(1, '#55efc4');
      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.moveTo(23, 0);
      ctx.lineTo(13, -5.5);
      ctx.lineTo(15, 0);
      ctx.lineTo(13, 5.5);
      ctx.closePath();
      ctx.fill();
    } else if (el === 'wind') {
      // Hệ Gió: Mũi tên gió mờ ảo thanh thoát
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(12, -5);
      ctx.lineTo(14, 0);
      ctx.lineTo(12, 5);
      ctx.closePath();
      ctx.fill();
    } else if (el === 'poison') {
      // Hệ Độc: Mũi tên độc tím pha xanh nhỏ giọt
      const poiGrad = ctx.createLinearGradient(12, 0, 23, 0);
      poiGrad.addColorStop(0, '#2c2c54');
      poiGrad.addColorStop(0.6, '#8e44ad');
      poiGrad.addColorStop(1, '#2ed573');
      ctx.fillStyle = poiGrad;
      ctx.beginPath();
      ctx.moveTo(23, 0);
      ctx.lineTo(13, -6);
      ctx.lineTo(15, 0);
      ctx.lineTo(13, 6);
      ctx.closePath();
      ctx.fill();
    } else {
      // Hệ Nổ & Cung cơ bản
      const expGrad = ctx.createLinearGradient(12, 0, 24, 0);
      expGrad.addColorStop(0, '#ff793f');
      expGrad.addColorStop(0.7, '#ff3838');
      expGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = expGrad;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(13, -6);
      ctx.lineTo(15, 0);
      ctx.lineTo(13, 6);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  getGlowColor() {
    switch (this.weapon.element) {
      case 'fire': return '#ff4757';
      case 'ice': return '#70a1ff';
      case 'lightning': return '#ffd32a';
      case 'poison': return '#a55eea';
      case 'water': return '#00d2d3';
      case 'wood': return '#2ed573';
      case 'wind': return '#ffffff';
      case 'explosion': return '#ff3838';
      default: return '#ffa502';
    }
  }
}

// ============================================================================
// 7. HỘP CỨU THƯƠNG (MEDIKIT SUPPLY DROP)
// ============================================================================

class Medikit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 36;
    this.height = 36;
    this.vy = 65;
    this.active = true;
    this.landed = false;
    this.angle = 0;
  }

  update(dt, groundY, platforms) {
    if (!this.active) return;
    if (!this.landed) {
      this.y += this.vy * dt;
      this.angle = Math.sin(Date.now() / 250) * 0.15;

      for (let plat of platforms) {
        if (plat.type === 'platform' &&
            this.x + this.width > plat.x && this.x < plat.x + plat.width &&
            this.y + this.height >= plat.y && this.y + this.height <= plat.y + 20) {
          this.y = plat.y - this.height;
          this.landed = true;
          this.vy = 0;
          return;
        }
      }

      if (this.y + this.height >= groundY) {
        this.y = groundY - this.height;
        this.landed = true;
        this.vy = 0;
      }
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle);

    if (!this.landed) {
      ctx.beginPath();
      ctx.arc(0, -32, 24, Math.PI, 0, false);
      ctx.fillStyle = '#ff6b81';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-22, -32); ctx.lineTo(-10, -10);
      ctx.moveTo(22, -32); ctx.lineTo(10, -10);
      ctx.moveTo(0, -32); ctx.lineTo(0, -10);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-4, -12, 8, 24);
    ctx.fillRect(-12, -4, 24, 8);

    ctx.restore();
  }
}

// ============================================================================
// 7B. GÓI NĂNG LƯỢNG TIẾP TẾ (ENERGY PACK SUPPLY DROP)
// ============================================================================

class EnergyPack {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 36;
    this.height = 36;
    this.vy = 65;
    this.active = true;
    this.landed = false;
    this.angle = 0;
    this.energyAmount = 35;
  }

  update(dt, groundY, platforms) {
    if (!this.active) return;
    if (!this.landed) {
      this.y += this.vy * dt;
      this.angle = Math.sin(Date.now() / 250) * 0.15;

      for (let plat of platforms) {
        if (plat.type === 'platform' &&
            this.x + this.width > plat.x && this.x < plat.x + plat.width &&
            this.y + this.height >= plat.y && this.y + this.height <= plat.y + 20) {
          this.y = plat.y - this.height;
          this.landed = true;
          this.vy = 0;
          return;
        }
      }

      if (!game || !game.isPit(this.x + this.width / 2)) {
        if (this.y + this.height >= groundY) {
          this.y = groundY - this.height;
          this.landed = true;
          this.vy = 0;
        }
      } else {
        if (this.y > 750) this.active = false;
      }
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle);

    if (!this.landed) {
      // Dù màu Cyan neon phát sáng
      ctx.beginPath();
      ctx.arc(0, -32, 24, Math.PI, 0, false);
      ctx.fillStyle = '#00d2d3';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-22, -32); ctx.lineTo(-10, -10);
      ctx.moveTo(22, -32); ctx.lineTo(10, -10);
      ctx.moveTo(0, -32); ctx.lineTo(0, -10);
      ctx.stroke();
    }

    // Khối năng lượng pin công nghệ cao
    ctx.fillStyle = '#0c2461';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.strokeStyle = '#00d2d3';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00d2d3';
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Ký hiệu tia sét ⚡ phát sáng vàng
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ffd32a';
    ctx.fillStyle = '#ffd32a';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', 0, 1);

    ctx.restore();
  }
}

// ============================================================================
// 7C. TÚI MÙ KỲ BÍ TIẾP TẾ (BLIND BAG SUPPLY DROP)
// Mở ra ngẫu nhiên: Boom nổ sát thương (33%), Hồi Máu (33%), Hồi Năng Lượng (34%)
// ============================================================================

class BlindBag {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 38;
    this.height = 38;
    this.vy = 55;
    this.active = true;
    this.landed = false;
    this.angle = 0;
    this.pulse = 0;
  }

  update(dt, groundY, platforms) {
    if (!this.active) return;
    this.pulse += dt * 4;
    if (!this.landed) {
      this.y += this.vy * dt;
      this.angle = Math.sin(Date.now() / 230) * 0.16;

      for (let plat of platforms) {
        if (plat.type === 'platform' &&
            this.x + this.width > plat.x && this.x < plat.x + plat.width &&
            this.y + this.height >= plat.y && this.y + this.height <= plat.y + 20) {
          this.y = plat.y - this.height;
          this.landed = true;
          this.vy = 0;
          return;
        }
      }

      if (this.y + this.height >= groundY) {
        this.y = groundY - this.height;
        this.landed = true;
        this.vy = 0;
      }
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle);

    // 1. Dù lượn 3 màu rực rỡ khi đang rơi
    if (!this.landed) {
      ctx.beginPath();
      ctx.arc(0, -32, 25, Math.PI, 0, false);
      const chuteGrad = ctx.createLinearGradient(-25, -32, 25, -32);
      chuteGrad.addColorStop(0, '#8854d0');
      chuteGrad.addColorStop(0.5, '#ffd32a');
      chuteGrad.addColorStop(1, '#ff3838');
      ctx.fillStyle = chuteGrad;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Dây dù
      ctx.beginPath();
      ctx.moveTo(-22, -32); ctx.lineTo(-10, -12);
      ctx.moveTo(22, -32); ctx.lineTo(10, -12);
      ctx.moveTo(0, -32); ctx.lineTo(0, -12);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // 2. Hộp Túi Mù nhấp nháy hào quang vàng huyền bí
    const scale = 1.0 + Math.sin(this.pulse) * 0.05;
    ctx.scale(scale, scale);

    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ffd32a';

    const boxGrad = ctx.createLinearGradient(-this.width/2, -this.height/2, this.width/2, this.height/2);
    boxGrad.addColorStop(0, '#6c5ce7');
    boxGrad.addColorStop(0.5, '#0984e3');
    boxGrad.addColorStop(1, '#d63031');
    ctx.fillStyle = boxGrad;

    // Vẽ hộp bo góc
    const r = 8;
    const w = this.width;
    const h = this.height;
    ctx.beginPath();
    ctx.moveTo(-w/2 + r, -h/2);
    ctx.lineTo(w/2 - r, -h/2);
    ctx.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
    ctx.lineTo(w/2, h/2 - r);
    ctx.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
    ctx.lineTo(-w/2 + r, h/2);
    ctx.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
    ctx.lineTo(-w/2, -h/2 + r);
    ctx.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffd32a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Ruy băng quà tặng vàng
    ctx.fillStyle = '#ffd32a';
    ctx.fillRect(-w/2, -3, w, 6);
    ctx.fillRect(-3, -h/2, 6, h);

    // Biểu tượng Dấu Hỏi Chấm Bí Ẩn ❓
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    ctx.font = 'bold 20px "Fredoka One", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❓', 0, 1);

    ctx.restore();
  }
}

// ============================================================================
// 8. NHÂN VẬT CHIBI (CHARACTER CLASS) - NHẢY 2 LẦN & HOẠT ẢNH GỤC NGÃ BIẾN MẤT
// ============================================================================

class Character {
  constructor(id, name, x, y, facingRight = true, color = '#2ed573') {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.facingRight = facingRight;
    this.color = color;

    this.maxHp = 1000;
    this.hp = 1000;
    this.isDead = false;

    // HỆ THỐNG NĂNG LƯỢNG (ENERGY SYSTEM)
    this.maxEnergy = 100;
    this.energy = 100;
    this.energyRegenRate = 2; // +2 năng lượng mỗi giây

    // Cơ chế gục ngã (Defeat Animation)
    this.defeatState = 'ALIVE'; // 'ALIVE', 'COLLAPSING', 'DISAPPEARED'
    this.defeatTimer = 0;
    this.collapseAngle = 0;
    this.deathOpacity = 1.0;

    this.width = 32;
    this.height = 54;

    this.weapon = WEAPONS[0];
    this.helmet = ARMORS.helmet[0];
    this.chest = ARMORS.chest[0];
    this.boots = ARMORS.boots[0];

    this.isCrouching = false;
    this.isGrounded = true;
    this.moveSpeed = 220;

    // Cơ chế Nhảy 2 lần (Double Jump)
    this.jumpForce = -470;
    this.jumpCount = 0;
    this.maxJumps = 2; // Cho phép nhảy 2 lần liên tục

    this.aimAngle = facingRight ? -0.4 : -2.7;
    this.isCharging = false;
    this.chargePower = 0;
    this.chargeSpeed = 95;

    this.statusEffects = {
      stun: 0,
      freeze: 0,
      burn: 0,
      poison: 0,
      slow: 0,
      levitate: 0
    };
    this.windBounceCooldown = 0;
    this.dotTickTimer = 0;

    this.totalDamageDealt = 0;
    this.shotsFired = 0;
    this.hitsLanded = 0;
    this.hurtTimer = 0;

    this.isBot = false;
    this.botAiState = null;
  }

  getHitboxes() {
    if (this.isDead || this.defeatState !== 'ALIVE') {
      return {
        head: { x: -9999, y: -9999, width: 0, height: 0 },
        body: { x: -9999, y: -9999, width: 0, height: 0 },
        limbs: { x: -9999, y: -9999, width: 0, height: 0 }
      };
    }

    const currentH = this.isCrouching ? this.height * 0.65 : this.height;
    const topY = this.y - currentH;
    const headH = currentH * 0.32;
    const bodyH = currentH * 0.38;
    const limbsH = currentH * 0.30;

    return {
      head: { x: this.x - this.width * 0.45, y: topY, width: this.width * 0.9, height: headH },
      body: { x: this.x - this.width * 0.5, y: topY + headH, width: this.width, height: bodyH },
      limbs: { x: this.x - this.width * 0.4, y: topY + headH + bodyH, width: this.width * 0.8, height: limbsH }
    };
  }

  // KÍCH HOẠT HIỆU ỨNG GỤC NGÃ KHI HẾT MÁU
  triggerDefeat() {
    if (this.isDead || this.defeatState !== 'ALIVE') return;
    this.isDead = true;
    this.hp = 0;
    this.defeatState = 'COLLAPSING';
    this.defeatTimer = 2.4; // Thời gian hiệu ứng gục ngã trước khi biến mất
    this.collapseAngle = 0;
    this.deathOpacity = 1.0;
    sounds.playDefeatSound();

    // Hồn ma chibi bay lên trời
    game.particles.push(new Particle(this.x, this.y - 28, 0, -45, '#ffffff', 8, 2.0, 'ghost'));

    // Chữ bay Defeated
    game.floatingTexts.push(new FloatingText(this.x, this.y - 60, `☠️ ${this.name} GỤC NGÃ!`, '#ff4757', 22, true));

    // Kiểm tra kết thúc trận đấu nếu chỉ còn 1 người sống sót
    if (game.checkFFAWinCondition) {
      game.checkFFAWinCondition();
    }
  }

  update(dt, groundY, platforms) {
    // Xử lý hiệu ứng gục ngã và tan biến
    if (this.defeatState === 'COLLAPSING') {
      this.defeatTimer -= dt;
      // Góc ngã nghiêng dần 90 độ xuống mặt đất
      this.collapseAngle = Math.min(Math.PI / 2, this.collapseAngle + dt * 2.8);

      // Độ mờ đục giảm dần sau 0.8 giây đầu
      if (this.defeatTimer < 1.4) {
        this.deathOpacity = Math.max(0, this.defeatTimer / 1.4);
      }

      // Sinh bụi ma thuật tan biến lấp lánh
      if (Math.random() < 0.4) {
        game.particles.push(new Particle(
          this.x + (Math.random()-0.5)*30,
          this.y - 15 + (Math.random()-0.5)*20,
          (Math.random()-0.5)*20, -30,
          '#ffd32a', 3, 0.6, 'spark'
        ));
      }

      if (this.defeatTimer <= 0) {
        this.defeatState = 'DISAPPEARED';
      }

      // Vẫn chịu trọng lực để nằm vững trên đất/bục
      this.vy += 980 * dt;
      this.y += this.vy * dt;
      if (this.y >= groundY) {
        this.y = groundY;
        this.vy = 0;
      }
      return;
    }

    if (this.defeatState === 'DISAPPEARED') return;

    if (this.hurtTimer > 0) this.hurtTimer -= dt;
    if (this.windBounceCooldown > 0) this.windBounceCooldown -= dt;

    this.updateStatusEffects(dt);

    if (this.statusEffects.freeze > 0 || this.statusEffects.stun > 0 || this.statusEffects.levitate > 0) {
      this.isCharging = false;
      this.chargePower = 0;
      this.vx = 0;
      if (this.statusEffects.levitate > 0) {
        this.vy = 0; // Treo lơ lửng trên không, triệt tiêu trọng lực
        if (Math.random() < 0.5) {
          game.particles.push(new Particle(this.x + (Math.random()-0.5)*20, this.y - 8, (Math.random()-0.5)*20, -25, '#00d2d3', 2.5, 0.3, 'circle'));
        }
      }
    } else {
      if (this.isCharging) {
        this.chargePower += this.chargeSpeed * dt;
        if (this.chargePower >= 100) this.chargePower = 100;
        sounds.playBowCharge(this.chargePower / 100);
      }

      let effectiveSpeed = this.moveSpeed;
      if (this.statusEffects.slow > 0) effectiveSpeed *= 0.5;
      this.x += this.vx * effectiveSpeed * dt;

      // Hướng nhìn tự động bám sát góc nhắm
      this.facingRight = Math.cos(this.aimAngle) >= 0;
    }

    // Trọng lực rơi (ngừng rơi hoàn toàn khi bị hiệu ứng treo lơ lửng)
    if (this.statusEffects.levitate > 0) {
      this.vy = 0;
    } else {
      this.vy += 980 * dt;
      this.y += this.vy * dt;
    }

    // Tiếp đất trên bục nổi (Platforms) hoặc va chạm thạch trụ
    this.isGrounded = false;
    for (let plat of platforms) {
      if (plat.type === 'platform') {
        const charFoot = this.y;
        const prevFoot = this.y - this.vy * dt;
        if (this.x + this.width * 0.3 > plat.x && this.x - this.width * 0.3 < plat.x + plat.width) {
          if (prevFoot <= plat.y && charFoot >= plat.y && this.vy >= 0) {
            this.y = plat.y;
            this.vy = 0;
            this.isGrounded = true;
            this.jumpCount = 0; // Hồi lại số lần nhảy khi tiếp đất
            break;
          }
        }
      } else if (plat.type === 'pillar') {
        const halfW = this.width / 2;
        if (this.y > plat.y && this.y - this.height < plat.y + plat.height) {
          if (this.x + halfW > plat.x && this.x < plat.x) {
            this.x = plat.x - halfW;
          } else if (this.x - halfW < plat.x + plat.width && this.x > plat.x + plat.width) {
            this.x = plat.x + plat.width + halfW;
          }
        }
      }
    }

    // Sàn đất liền vững chắc trải dài toàn bộ bản đồ (Hố đã được xóa hoàn toàn)
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.isGrounded = true;
      this.jumpCount = 0; // Hồi lại số lần nhảy khi tiếp đất sàn đáy
    }

    const halfW = this.width / 2;
    if (this.x < halfW + 20) this.x = halfW + 20;
    if (this.x > 1280 - halfW - 20) this.x = 1280 - halfW - 20;
  }

  fallIntoPit() {
    if (this.isDead) return;
    this.hp = 0;
    this.triggerDefeat();
    sounds.playPitFall();
    game.floatingTexts.push(new FloatingText(this.x, 620, '💀 RƠI XUỐNG VỰC SÂU!', '#ff3838', 24, true));
    for (let i = 0; i < 25; i++) {
      game.particles.push(new Particle(
        this.x, 650,
        (Math.random() - 0.5) * 140,
        -Math.random() * 120 - 40,
        '#ff4757', 5, 0.6, 'smoke'
      ));
    }
  }

  getArrowEnergyCost() {
    const tier = this.weapon ? this.weapon.tier : 'A';
    switch (tier) {
      case 'SSS': return 8;
      case 'SS':  return 6;
      case 'S':   return 4;
      case 'A':
      default:    return 2;
    }
  }

  addEnergy(amount) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
  }

  updateStatusEffects(dt) {
    // Tự động hồi năng lượng 3 điểm mỗi giây khi còn sống
    if (this.defeatState === 'ALIVE') {
      this.energy = Math.min(this.maxEnergy, this.energy + this.energyRegenRate * dt);
    }

    for (let key in this.statusEffects) {
      if (this.statusEffects[key] > 0) {
        this.statusEffects[key] -= dt;
      }
    }

    this.dotTickTimer += dt;
    if (this.dotTickTimer >= 0.5) {
      this.dotTickTimer = 0;
      let dotDmg = 0;

      if (this.statusEffects.burn > 0) {
        dotDmg += 25;
        game.particles.push(new Particle(this.x, this.y - 40, (Math.random()-0.5)*40, -40, '#ff4757', 5, 0.4, 'circle'));
      }
      if (this.statusEffects.poison > 0) {
        dotDmg += 18;
        game.particles.push(new Particle(this.x, this.y - 40, (Math.random()-0.5)*40, -40, '#a55eea', 5, 0.4, 'smoke'));
      }

      if (dotDmg > 0) {
        this.hp = Math.max(0, this.hp - dotDmg);
        game.floatingTexts.push(new FloatingText(this.x, this.y - 70, `-${Math.round(dotDmg)}`, '#e74c3c', 16));
        if (this.hp <= 0) {
          this.triggerDefeat();
        }
      }
    }
  }

  startCharge() {
    if (this.statusEffects.freeze > 0 || this.statusEffects.stun > 0 || this.isDead) return;
    const cost = this.getArrowEnergyCost();
    if (this.energy < cost) {
      sounds.playNoEnergy();
      game.floatingTexts.push(new FloatingText(this.x, this.y - 65, `⚡ HẾT NĂNG LƯỢNG! (Cần ${cost}⚡)`, '#ffd32a', 18, true));
      return;
    }
    this.isCharging = true;
    this.chargePower = 0; // Bắt đầu từ 0% để nếu bấm nhả tức thì sẽ có lực cực nhỏ (rơi tại chỗ)
  }

  releaseCharge(forcedPower = null) {
    if ((!this.isCharging && forcedPower === null) || this.isDead) return;
    const cost = this.getArrowEnergyCost();
    if (this.energy < cost) {
      sounds.playNoEnergy();
      game.floatingTexts.push(new FloatingText(this.x, this.y - 65, `⚡ HẾT NĂNG LƯỢNG! (Cần ${cost}⚡)`, '#ffd32a', 18, true));
      this.isCharging = false;
      this.chargePower = 0;
      return;
    }
    const power = forcedPower !== null ? forcedPower : this.chargePower;
    this.isCharging = false;
    this.chargePower = 0;
    this.fireArrow(power);
  }

  fireArrow(power) {
    const cost = this.getArrowEnergyCost();
    if (this.energy < cost) {
      sounds.playNoEnergy();
      return;
    }
    this.energy = Math.max(0, this.energy - cost);

    this.shotsFired++;
    sounds.playShoot(this.weapon.element);

    const currentH = this.isCrouching ? this.height * 0.65 : this.height;
    const spawnX = this.x + Math.cos(this.aimAngle) * 24;
    const spawnY = (this.y - currentH * 0.55) + Math.sin(this.aimAngle) * 24;

    const arrow = new Arrow(this.id, spawnX, spawnY, this.aimAngle, power, this.weapon);
    game.arrows.push(arrow);

    if (this.weapon.element === 'lightning') {
      game.lightnings.push(new LightningBolt(spawnX, spawnY, spawnX + Math.cos(this.aimAngle)*60, spawnY + Math.sin(this.aimAngle)*60));
    } else if (this.weapon.element === 'wood') {
      for (let i = 0; i < 6; i++) {
        game.particles.push(new Particle(spawnX, spawnY, (Math.random()-0.5)*60, (Math.random()-0.5)*60, '#2ed573', 5, 0.4, 'leaf'));
      }
    }
  }

  // CƠ CHẾ NHẢY 2 LẦN (DOUBLE JUMP)
  jump() {
    if (this.statusEffects.freeze > 0 || this.statusEffects.stun > 0 || this.statusEffects.levitate > 0 || this.isDead) return;

    if (this.isGrounded) {
      // Cú nhảy lần 1
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.jumpCount = 1;
      sounds.playJump(false);
    } else if (this.jumpCount === 1) {
      // Cú nhảy lần 2 (Double Jump - bật cao hơn)
      this.vy = this.jumpForce * 1.08;
      this.jumpCount = 2;
      sounds.playJump(true);

      // Hiệu ứng sóng xung kích dưới chân khi kích hoạt Double Jump
      game.particles.push(new Particle(this.x, this.y, 0, 0, '#48dbfb', 1, 0.4, 'shockwave'));
      for (let i = 0; i < 8; i++) {
        game.particles.push(new Particle(this.x, this.y, (Math.random()-0.5)*80, 20 + Math.random()*30, '#ffffff', 3, 0.3, 'circle'));
      }
    }
  }

  crouch(isDown) {
    this.isCrouching = isDown;
  }

  // ĐIỀU CHỈNH QUAY HƯỚNG & LẬT ĐỐI XỨNG GÓC NHẮM
  setFacing(toRight) {
    if (this.facingRight === toRight || this.isDead) return;
    this.facingRight = toRight;
    // Lật góc nhắm đối xứng gương qua trục thẳng đứng Y:
    const sinA = Math.sin(this.aimAngle);
    const cosA = Math.cos(this.aimAngle);
    this.aimAngle = Math.atan2(sinA, -cosA);
  }

  takeDamage(arrow, hitboxName) {
    if (this.isDead || this.defeatState !== 'ALIVE') return;
    this.hurtTimer = 0.25;

    // Đẩy lùi (Knockback) nhẹ khi trúng đạn
    this.vx += Math.cos(arrow.angle) * 75;
    this.vy -= 40;

    let multiplier = 1.0;
    let defPercent = 0;

    if (hitboxName === 'head') {
      multiplier = 2.0;
      defPercent = this.helmet ? this.helmet.defPercent : 0;
    } else if (hitboxName === 'body') {
      multiplier = 1.0;
      defPercent = this.chest ? this.chest.defPercent : 0;
    } else {
      multiplier = 0.5;
      defPercent = this.boots ? this.boots.defPercent : 0;
    }

    const rawDamage = (arrow.weapon ? arrow.weapon.baseDamage : 20) * multiplier;
    const actualDamage = Math.max(3, Math.round(rawDamage * (1 - (defPercent || 0) / 100)));
    this.hp = Math.max(0, this.hp - actualDamage);

    const shooter = game && game.getCharacterById ? game.getCharacterById(arrow.owner) : null;
    if (shooter) {
      shooter.totalDamageDealt += actualDamage;
      shooter.hitsLanded++;

      if (arrow.weapon && arrow.weapon.element === 'wood') {
        const healAmt = Math.round(actualDamage * 0.4);
        shooter.heal(healAmt);
        game.floatingTexts.push(new FloatingText(shooter.x, shooter.y - 70, `+${healAmt} HP (Hút Máu)`, '#2ed573', 20));
      }
    }

    if (arrow.weapon) {
      this.applyElementalEffect(arrow.weapon.element);
    }
    sounds.playHit(hitboxName);

    const isCrit = hitboxName === 'head';
    const textPrefix = isCrit ? '💥 CRIT! -' : '-';
    const textColor = isCrit ? '#ff4757' : (hitboxName === 'body' ? '#ffa502' : '#f1f2f6');
    game.floatingTexts.push(new FloatingText(this.x, this.y - 48, `${textPrefix}${actualDamage}`, textColor, isCrit ? 24 : 18, isCrit));

    // Ghi nhận sự kiện trúng đạn để phát sóng đồng bộ cho toàn bộ phòng
    if (game && game.recordHitEvent) {
      game.recordHitEvent({
        targetId: this.id,
        shooterId: arrow.owner,
        hitbox: hitboxName,
        damage: actualDamage,
        isCrit: isCrit,
        element: arrow.weapon ? arrow.weapon.element : 'none',
        x: this.x,
        y: this.y - 35
      });
    }

    if (typeof game !== 'undefined' && game.spawnElementalImpact) {
      game.spawnElementalImpact(arrow.x, arrow.y, arrow.weapon ? arrow.weapon.element : 'none', isCrit ? 1.4 : 1.05);
    } else {
      for (let i = 0; i < 15; i++) {
        game.particles.push(new Particle(
          this.x, this.y - 28,
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 120 - 40,
          isCrit ? '#ff3838' : '#e74c3c', 3.5, 0.4
        ));
      }
    }

    if (this.hp <= 0) {
      this.triggerDefeat();
    }
  }

  applyElementalEffect(element) {
    switch (element) {
      case 'lightning':
        this.statusEffects.stun = 1.0;
        game.lightnings.push(new LightningBolt(this.x, this.y - 180, this.x, this.y - 20, '#ffd32a', 7));
        break;
      case 'water':
        this.statusEffects.slow = 3.0;
        for (let i = 0; i < 12; i++) {
          game.particles.push(new Particle(this.x, this.y - 30, (Math.random()-0.5)*120, (Math.random()-0.5)*120, '#1e90ff', 4, 0.4));
        }
        break;
      case 'ice':
        this.statusEffects.freeze = 1.5;
        for (let i = 0; i < 15; i++) {
          game.particles.push(new Particle(this.x, this.y - 30, (Math.random()-0.5)*100, (Math.random()-0.5)*100, '#70a1ff', 4, 0.5, 'spark'));
        }
        break;
      case 'poison':
        this.statusEffects.poison = 4.0;
        for (let i = 0; i < 15; i++) {
          game.particles.push(new Particle(this.x, this.y - 30, (Math.random()-0.5)*80, -30, '#a55eea', 6, 0.5, 'smoke'));
        }
        break;
      case 'fire':
        this.statusEffects.burn = 3.0;
        for (let i = 0; i < 15; i++) {
          game.particles.push(new Particle(this.x, this.y - 30, (Math.random()-0.5)*80, -40, '#ff4757', 5, 0.4));
        }
        break;
      case 'explosion':
        sounds.playExplosion();
        for (let i = 0; i < 35; i++) {
          game.particles.push(new Particle(
            this.x, this.y - 30,
            (Math.random() - 0.5) * 260,
            (Math.random() - 0.5) * 260,
            '#ff4757', 6, 0.6, 'spark'
          ));
        }
        break;
      case 'wind':
        this.statusEffects.levitate = 0.5; // Cung Vũ Dực: Treo lơ lửng trong 0.5s
        this.vy = 0; // Ngắt rơi tự do ngay lập tức
        this.vx = 0; // Ngắt quán tính di chuyển ngang
        for (let i = 0; i < 15; i++) {
          game.particles.push(new Particle(this.x, this.y - 20, (Math.random()-0.5)*50, -40 - Math.random()*30, '#00d2d3', 3.5, 0.45, 'circle'));
        }
        game.floatingTexts.push(new FloatingText(this.x, this.y - 50, '🌪️ LƠ LỬNG (0.5s)', '#00d2d3', 18, true));
        break;
    }
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    sounds.playHeal();
    for (let i = 0; i < 12; i++) {
      game.particles.push(new Particle(
        this.x + (Math.random() - 0.5) * 40,
        this.y - 30 + (Math.random() - 0.5) * 40,
        0, -60, '#2ed573', 4, 0.5, 'leaf'
      ));
    }
  }

  draw(ctx) {
    if (this.defeatState === 'DISAPPEARED') return;

    ctx.save();
    ctx.globalAlpha = this.deathOpacity;

    // Hiệu ứng ngã nghiêng khi gục ngã
    if (this.defeatState === 'COLLAPSING') {
      const fallDir = this.facingRight ? 1 : -1;
      ctx.translate(this.x, this.y);
      ctx.rotate(fallDir * this.collapseAngle);
      ctx.translate(-this.x, -this.y);
    }

    if (this.hurtTimer > 0) {
      ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    }

    const currentH = this.isCrouching ? this.height * 0.65 : this.height;
    const isP1 = this.id === 'p1';

    const armorTier = this.getArmorTierRank();

    // 0. TRƯỜNG LỰC HOÀNG KIM (FORCE FIELD) CẤP SSS LẤP LÁNH CHUYỂN MÀU VÀNG KIM
    if (armorTier === 'SSS' && this.defeatState === 'ALIVE') {
      const time = Date.now() / 320;
      const centerY = this.y - currentH * 0.52;
      const goldShift = Math.sin(time);
      const goldShift2 = Math.cos(time * 0.85);

      ctx.save();
      ctx.shadowBlur = 24 + 8 * Math.sin(time * 2);
      ctx.shadowColor = '#ffd32a';

      // Chuyển màu vàng kim liên tục: vàng chanh -> vàng kim chói sáng -> hổ phách hoàng gia
      const ffGrad = ctx.createRadialGradient(
        this.x, centerY, 8,
        this.x, centerY, 34
      );
      ffGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      ffGrad.addColorStop(0.5, `rgba(${Math.round(255 - 6 * Math.abs(goldShift))}, ${Math.round(215 + 30 * goldShift)}, ${Math.round(50 + 40 * goldShift2)}, ${0.28 + 0.12 * goldShift})`);
      ffGrad.addColorStop(0.9, `rgba(255, 215, 0, ${0.46 + 0.16 * goldShift2})`);
      ffGrad.addColorStop(1, 'rgba(243, 156, 18, 0.14)');

      ctx.fillStyle = ffGrad;
      ctx.beginPath();
      ctx.ellipse(this.x, centerY, 28, currentH * 0.58 + 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vành sóng năng lượng dao động bao quanh trường lực
      ctx.strokeStyle = `rgba(255, 234, 167, ${0.72 + 0.24 * Math.sin(time * 3)})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(this.x, centerY, 28, currentH * 0.58 + 6, Math.sin(time * 0.5) * 0.12, 0, Math.PI * 2);
      ctx.stroke();

      // Đai xoay hạt ánh sáng vàng kim lấp lánh quanh chu vi
      const ringAngle = time * 2.2;
      for (let k = 0; k < 4; k++) {
        const pAng = ringAngle + (k * Math.PI / 2);
        const px = this.x + Math.cos(pAng) * 28;
        const py = centerY + Math.sin(pAng) * (currentH * 0.58 + 6);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 2.6 + 0.8 * Math.sin(time * 4 + k), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 0B. HÀO QUANG AURA TRANG BỊ THEO ĐẲNG CẤP (A, S, SS, SSS)
    if (armorTier === 'SSS') {
      ctx.shadowBlur = 22;
      ctx.shadowColor = 'rgba(254, 202, 87, 0.85)';
    } else if (armorTier === 'SS') {
      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(0, 210, 211, 0.75)';
    } else if (armorTier === 'S') {
      ctx.shadowBlur = 11;
      ctx.shadowColor = 'rgba(84, 160, 255, 0.65)';
    } else if (armorTier === 'A') {
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(46, 213, 115, 0.5)';
    } else {
      ctx.shadowBlur = 0;
    }

    // 1. TỨ CHI - ỦNG KIM LOẠI LINEAR GRADIENT
    const legH = currentH * 0.28;
    const legY = this.y - legH;
    const bootsGrad = ctx.createLinearGradient(this.x - 12, legY, this.x + 12, legY + legH);
    const bTier = this.boots ? this.boots.tier : 'D';
    if (bTier === 'SSS') {
      bootsGrad.addColorStop(0, '#f39c12');
      bootsGrad.addColorStop(0.3, '#f1c40f');
      bootsGrad.addColorStop(0.5, '#ffffff'); // Vệt phản quang ánh kim
      bootsGrad.addColorStop(0.7, '#ffd32a');
      bootsGrad.addColorStop(1, '#d35400');
    } else if (bTier === 'SS') {
      bootsGrad.addColorStop(0, '#006266');
      bootsGrad.addColorStop(0.35, '#00d2d3');
      bootsGrad.addColorStop(0.55, '#ffffff');
      bootsGrad.addColorStop(1, '#0984e3');
    } else if (bTier === 'S') {
      bootsGrad.addColorStop(0, '#2f3542');
      bootsGrad.addColorStop(0.35, '#747d8c');
      bootsGrad.addColorStop(0.5, '#f1f2f6');
      bootsGrad.addColorStop(1, '#57606f');
    } else if (bTier === 'A') {
      bootsGrad.addColorStop(0, '#2f3640');
      bootsGrad.addColorStop(0.4, '#718093');
      bootsGrad.addColorStop(0.6, '#dfe4ea');
      bootsGrad.addColorStop(1, '#1e272e');
    } else {
      bootsGrad.addColorStop(0, '#353b48');
      bootsGrad.addColorStop(1, '#1e272e');
    }

    ctx.fillStyle = bootsGrad;
    ctx.beginPath();
    ctx.roundRect(this.x - 11, legY, 7.5, legH, 2.5);
    ctx.roundRect(this.x + 3.5, legY, 7.5, legH, 2.5);
    ctx.fill();

    // Mảnh nẹp giáp ống chân kim loại
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(this.x - 9.5, legY + 2, 2, legH - 4);
    ctx.fillRect(this.x + 5, legY + 2, 2, legH - 4);

    ctx.fillStyle = bootsGrad;
    ctx.beginPath();
    ctx.arc(this.x - 7, this.y - 2, 4.5, 0, Math.PI * 2);
    ctx.arc(this.x + 7, this.y - 2, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. THÂN - ÁO GIÁP LINEAR GRADIENT KIM LOẠI
    const bodyH = currentH * 0.38;
    const bodyY = legY - bodyH;
    const chestGrad = ctx.createLinearGradient(this.x - 13, bodyY, this.x + 13, bodyY + bodyH);
    const cTier = this.chest ? this.chest.tier : 'D';
    if (cTier === 'SSS') {
      chestGrad.addColorStop(0, '#b71540');
      chestGrad.addColorStop(0.2, '#e55039');
      chestGrad.addColorStop(0.45, '#f6b93b');
      chestGrad.addColorStop(0.6, '#ffffff'); // Ánh bóng kim loại rực rỡ
      chestGrad.addColorStop(0.8, '#f39c12');
      chestGrad.addColorStop(1, '#6c5ce7');
    } else if (cTier === 'SS') {
      chestGrad.addColorStop(0, '#0c2461');
      chestGrad.addColorStop(0.3, '#1e3799');
      chestGrad.addColorStop(0.5, '#4a69bd');
      chestGrad.addColorStop(0.65, '#ffffff');
      chestGrad.addColorStop(1, '#00d2d3');
    } else if (cTier === 'S') {
      chestGrad.addColorStop(0, '#2c3e50');
      chestGrad.addColorStop(0.3, '#576574');
      chestGrad.addColorStop(0.5, '#dcdde1');
      chestGrad.addColorStop(0.7, '#8395a7');
      chestGrad.addColorStop(1, '#222f3e');
    } else if (cTier === 'A') {
      chestGrad.addColorStop(0, '#10ac84');
      chestGrad.addColorStop(0.35, '#1dd1a1');
      chestGrad.addColorStop(0.55, '#ffffff');
      chestGrad.addColorStop(0.75, '#10ac84');
      chestGrad.addColorStop(1, '#01a3a4');
    } else {
      chestGrad.addColorStop(0, isP1 ? '#2ed573' : '#ff4757');
      chestGrad.addColorStop(0.5, isP1 ? '#26de81' : '#ff6b81');
      chestGrad.addColorStop(1, isP1 ? '#10ac84' : '#ee5253');
    }

    ctx.fillStyle = chestGrad;
    ctx.beginPath();
    ctx.roundRect(this.x - 13, bodyY, 26, bodyH, [6, 6, 4, 4]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Khối ốp giáp ngực kim loại phản quang
    ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
    ctx.fillRect(this.x - 9, bodyY + 3, 18, 3.5);

    // 3. ĐẦU VÀ KHUÔN MẶT
    const headRadius = 15;
    const headY = bodyY - headRadius + 3;

    ctx.fillStyle = '#f8c291';
    ctx.beginPath();
    ctx.arc(this.x, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e58e26';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Tóc nhân vật
    ctx.fillStyle = isP1 ? '#e67e22' : '#2c3e50';
    ctx.beginPath();
    ctx.arc(this.x, headY - 3, headRadius + 1.5, Math.PI, Math.PI * 2);
    ctx.fill();

    // MŨ BẢO HỘ KIM LOẠI LINEAR GRADIENT
    const hTier = this.helmet ? this.helmet.tier : 'D';
    if (hTier !== 'D') {
      const helmGrad = ctx.createLinearGradient(this.x - headRadius - 3, headY - 12, this.x + headRadius + 3, headY);
      if (hTier === 'SSS') {
        helmGrad.addColorStop(0, '#e67e22');
        helmGrad.addColorStop(0.25, '#f1c40f');
        helmGrad.addColorStop(0.5, '#ffffff'); // Ánh vàng rực rỡ vương miện
        helmGrad.addColorStop(0.75, '#ffd32a');
        helmGrad.addColorStop(1, '#d35400');
      } else if (hTier === 'SS') {
        helmGrad.addColorStop(0, '#006266');
        helmGrad.addColorStop(0.3, '#00d2d3');
        helmGrad.addColorStop(0.55, '#ffffff');
        helmGrad.addColorStop(1, '#54a0ff');
      } else if (hTier === 'S') {
        helmGrad.addColorStop(0, '#2f3542');
        helmGrad.addColorStop(0.35, '#747d8c');
        helmGrad.addColorStop(0.55, '#f1f2f6');
        helmGrad.addColorStop(1, '#57606f');
      } else { // 'A'
        helmGrad.addColorStop(0, '#10ac84');
        helmGrad.addColorStop(0.4, '#2ed573');
        helmGrad.addColorStop(0.6, '#ffffff');
        helmGrad.addColorStop(1, '#006266');
      }

      ctx.save();
      ctx.fillStyle = helmGrad;
      ctx.beginPath();
      ctx.arc(this.x, headY - 2, headRadius + 2.5, Math.PI * 0.88, Math.PI * 2.12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Đỉnh vương miện cho cấp SSS
      if (hTier === 'SSS') {
        ctx.fillStyle = '#ffd32a';
        ctx.beginPath();
        ctx.moveTo(this.x - 7, headY - headRadius - 1);
        ctx.lineTo(this.x, headY - headRadius - 7);
        ctx.lineTo(this.x + 7, headY - headRadius - 1);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, headY - headRadius - 4, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    const eyeOffset = this.facingRight ? 3.5 : -3.5;
    ctx.fillStyle = '#2f3542';

    // Nếu đang gục ngã: mắt vẽ hình chữ X ngất xỉu
    if (this.defeatState === 'COLLAPSING') {
      ctx.strokeStyle = '#2f3542';
      ctx.lineWidth = 1.6;
      // Mắt trái X
      ctx.beginPath();
      ctx.moveTo(this.x - 7 + eyeOffset, headY - 2); ctx.lineTo(this.x - 2 + eyeOffset, headY + 3);
      ctx.moveTo(this.x - 2 + eyeOffset, headY - 2); ctx.lineTo(this.x - 7 + eyeOffset, headY + 3);
      // Mắt phải X
      ctx.moveTo(this.x + 2 + eyeOffset, headY - 2); ctx.lineTo(this.x + 7 + eyeOffset, headY + 3);
      ctx.moveTo(this.x + 7 + eyeOffset, headY - 2); ctx.lineTo(this.x + 2 + eyeOffset, headY + 3);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(this.x - 4.5 + eyeOffset, headY + 1, 3.2, 0, Math.PI * 2);
      ctx.arc(this.x + 4.5 + eyeOffset, headY + 1, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x - 5.5 + eyeOffset, headY - 0.5, 1.2, 0, Math.PI * 2);
      ctx.arc(this.x + 3.5 + eyeOffset, headY - 0.5, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 107, 129, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x - 8 + eyeOffset, headY + 5, 3, 0, Math.PI * 2);
    ctx.arc(this.x + 8 + eyeOffset, headY + 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // 4. CÁNH CUNG NGUYÊN TỐ (Chỉ vẽ nếu còn sống)
    if (this.defeatState === 'ALIVE') {
      this.drawElementalBow(ctx, this.x, bodyY + 7);
    }

    // Hiệu ứng Đóng Băng
    if (this.statusEffects.freeze > 0) {
      ctx.fillStyle = 'rgba(112, 161, 255, 0.45)';
      ctx.fillRect(this.x - 18, this.y - currentH - 6, 36, currentH + 10);
      ctx.strokeStyle = '#70a1ff';
      ctx.strokeRect(this.x - 18, this.y - currentH - 6, 36, currentH + 10);
    }

    // Hiệu ứng Bay Lơ Lửng gió
    if (this.statusEffects.levitate > 0) {
      const spin = Date.now() / 140;
      ctx.strokeStyle = 'rgba(0, 210, 211, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y - 4, 18, 6, spin, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y - 12, 14, 5, -spin, 0, Math.PI * 2);
      ctx.stroke();
    }

    // =========================================================================
    // THÔNG SỐ VÀ THẺ TÊN TRÊN ĐẦU (ĐẶT Ở LỚP CAO NHẤT, KHÔNG BỊ CHE LẤP)
    // =========================================================================
    if (this.defeatState === 'ALIVE') {
      ctx.save();
      const headTop = headY - headRadius - 6; // Đỉnh mũ/đầu

      // 1. Thanh Lực Tụ (khi đang giữ phím Space) - Vẽ ngay sát đỉnh đầu
      let currentTopY = headTop;
      if (this.isCharging) {
        const meterW = 44;
        const meterH = 6;
        const meterX = this.x - meterW / 2;
        const meterY = currentTopY - meterH - 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(meterX - 1, meterY - 1, meterW + 2, meterH + 2);

        const fillW = (this.chargePower / 100) * meterW;
        const grad = ctx.createLinearGradient(meterX, 0, meterX + meterW, 0);
        grad.addColorStop(0, '#2ed573');
        grad.addColorStop(0.5, '#ffa502');
        grad.addColorStop(1, '#ff4757');
        ctx.fillStyle = grad;
        ctx.fillRect(meterX, meterY, fillW, meterH);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(meterX - 1, meterY - 1, meterW + 2, meterH + 2);

        currentTopY = meterY - 4;
      } else {
        currentTopY = headTop - 3;
      }

      // 2. Mini Energy Bar (Thanh Năng Lượng)
      const barW = 46;
      const barX = this.x - barW / 2;
      const enH = 4;
      const enY = currentTopY - enH - 1;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(barX - 1, enY - 1, barW + 2, enH + 2);
      ctx.fillStyle = '#00d2d3';
      ctx.fillRect(barX, enY, barW * Math.max(0, this.energy / this.maxEnergy), enH);

      // 3. Mini HP Bar (Thanh Máu)
      const hpH = 7;
      const hpY = enY - hpH - 2;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(barX - 1, hpY - 1, barW + 2, hpH + 2);

      const hpRatio = Math.max(0, this.hp / this.maxHp);
      let hpColor = '#2ed573';
      if (hpRatio < 0.3) hpColor = '#ff4757';
      else if (hpRatio < 0.6) hpColor = '#ffa502';
      ctx.fillStyle = hpColor;
      ctx.fillRect(barX, hpY, barW * hpRatio, hpH);

      // Số máu rõ nét trên thanh máu
      ctx.font = 'bold 7px "Nunito", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.ceil(this.hp)}`, this.x, hpY + 6);

      // 4. Thẻ Tên Người Chơi (Nameplate Pill)
      const nameY = hpY - 5;
      ctx.font = 'bold 11px "Nunito", sans-serif';
      ctx.textAlign = 'center';
      const nameText = `[${this.id.toUpperCase()}] ${this.name}`;
      const nameWidth = ctx.measureText(nameText).width;

      ctx.fillStyle = 'rgba(12, 18, 28, 0.85)';
      ctx.fillRect(this.x - nameWidth / 2 - 5, nameY - 13, nameWidth + 10, 14);
      ctx.strokeStyle = this.color || '#fff';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(this.x - nameWidth / 2 - 5, nameY - 13, nameWidth + 10, 14);

      ctx.fillStyle = this.color || '#ffffff';
      ctx.fillText(nameText, this.x, nameY - 2);

      // 5. Hiệu ứng Choáng (Stun Stars) - Đặt phía trên Thẻ Tên
      if (this.statusEffects.stun > 0) {
        const starAng = Date.now() / 200;
        ctx.font = '14px serif';
        ctx.fillText('💫', this.x - 7 + Math.cos(starAng) * 11, nameY - 17);
      }

      ctx.restore();
    }

    ctx.restore();
  }

  drawElementalBow(ctx, pivotX, pivotY) {
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(this.aimAngle);

    const el = this.weapon ? this.weapon.element : 'none';
    const pullBack = this.isCharging ? (this.chargePower / 100) * 12 : 0;
    const now = Date.now();

    // 1. CÁNH CUNG NGUYÊN TỐ (GRADIENT & SHADOWBLUR GLOW)
    if (el === 'wood') {
      // Hệ Mộc: Cung màu xanh lục chuyển ngọc lục bảo, phát ánh sáng xanh
      const grad = ctx.createLinearGradient(5, -16, 18, 16);
      grad.addColorStop(0, '#2ed573');
      grad.addColorStop(0.35, '#00b894');
      grad.addColorStop(0.65, '#55efc4');
      grad.addColorStop(1, '#10ac84');

      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#2ed573';
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(10, 0, 16, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();

      // Búp ngọc lục bảo ở 2 đầu cánh cung
      ctx.fillStyle = '#55efc4';
      ctx.beginPath();
      ctx.arc(10 + Math.cos(-Math.PI / 2.2) * 16, Math.sin(-Math.PI / 2.2) * 16, 3.5, 0, Math.PI * 2);
      ctx.arc(10 + Math.cos(Math.PI / 2.2) * 16, Math.sin(Math.PI / 2.2) * 16, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Hạt lá mộc rụng nhẹ ngẫu nhiên
      if (Math.random() < 0.08 && typeof game !== 'undefined' && game.particles) {
        const rad = Math.random() < 0.5 ? -Math.PI / 2.2 : Math.PI / 2.2;
        const lx = pivotX + Math.cos(this.aimAngle) * 10 + Math.cos(this.aimAngle + rad) * 16;
        const ly = pivotY + Math.sin(this.aimAngle) * 10 + Math.sin(this.aimAngle + rad) * 16;
        game.particles.push(new Particle(lx, ly, (Math.random() - 0.5) * 20, 20 + Math.random() * 20, '#2ed573', 3, 0.4, 'leaf'));
      }
    } else if (el === 'lightning') {
      // Hệ Điện: Vàng chanh chớp nháy (alpha thay đổi liên tục), hạt tia lửa
      const electricAlpha = 0.55 + 0.45 * Math.sin(now / 35);
      const grad = ctx.createLinearGradient(6, -16, 18, 16);
      grad.addColorStop(0, '#fff200');
      grad.addColorStop(0.5, '#ffd32a');
      grad.addColorStop(1, '#f1c40f');

      ctx.save();
      ctx.globalAlpha = electricAlpha;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#fff200';
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      // Thân cung zích zắc kiểu tia sét
      ctx.moveTo(10 + Math.cos(-Math.PI / 2.2) * 16, Math.sin(-Math.PI / 2.2) * 16);
      ctx.lineTo(17, -8);
      ctx.lineTo(13, 0);
      ctx.lineTo(17, 8);
      ctx.lineTo(10 + Math.cos(Math.PI / 2.2) * 16, Math.sin(Math.PI / 2.2) * 16);
      ctx.stroke();

      // Nút năng lượng điện chớp lóa
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(13, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (el === 'explosion') {
      // Hệ Nổ: Cung mang sắc cam đỏ rực
      const grad = ctx.createLinearGradient(6, -16, 18, 16);
      grad.addColorStop(0, '#ff3838');
      grad.addColorStop(0.35, '#ff793f');
      grad.addColorStop(0.7, '#e17055');
      grad.addColorStop(1, '#c0392b');

      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ff4757';
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(10, 0, 16, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();

      // Nòng pháo kim loại chịu nhiệt ở thân cung
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(12, -4, 5, 8);
      ctx.strokeStyle = '#ff9f43';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(12, -4, 5, 8);
      ctx.restore();
    } else if (el === 'ice') {
      // Hệ Băng: Xanh lam nhạt, sắc cạnh, tỏa sương lạnh ở góc cung
      const grad = ctx.createLinearGradient(6, -16, 18, 16);
      grad.addColorStop(0, '#dff9fb');
      grad.addColorStop(0.4, '#70a1ff');
      grad.addColorStop(0.7, '#ffffff');
      grad.addColorStop(1, '#00d2d3');

      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#70a1ff';
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4.0;
      ctx.lineCap = 'square';
      ctx.beginPath();
      // Cánh cung tinh thể sắc cạnh
      ctx.moveTo(10 + Math.cos(-Math.PI / 2.2) * 16, Math.sin(-Math.PI / 2.2) * 16);
      ctx.lineTo(15, -7);
      ctx.lineTo(16, 0);
      ctx.lineTo(15, 7);
      ctx.lineTo(10 + Math.cos(Math.PI / 2.2) * 16, Math.sin(Math.PI / 2.2) * 16);
      ctx.stroke();

      // Luồng khói sương mờ tỏa ra từ 2 góc cánh cung
      const mistT = now / 400;
      const mistGrad1 = ctx.createRadialGradient(8, -15, 1, 8, -15, 10);
      mistGrad1.addColorStop(0, 'rgba(223, 249, 251, 0.65)');
      mistGrad1.addColorStop(1, 'rgba(112, 161, 255, 0)');
      ctx.fillStyle = mistGrad1;
      ctx.beginPath();
      ctx.arc(8 + Math.sin(mistT) * 2, -15, 8, 0, Math.PI * 2);
      ctx.fill();

      const mistGrad2 = ctx.createRadialGradient(8, 15, 1, 8, 15, 10);
      mistGrad2.addColorStop(0, 'rgba(223, 249, 251, 0.65)');
      mistGrad2.addColorStop(1, 'rgba(112, 161, 255, 0)');
      ctx.fillStyle = mistGrad2;
      ctx.beginPath();
      ctx.arc(8 + Math.cos(mistT) * 2, 15, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (el === 'fire') {
      // Hệ Lửa: Rực màu đỏ cam, có hạt lửa liên tục bốc lên từ thân cung
      const grad = ctx.createLinearGradient(6, -16, 18, 16);
      grad.addColorStop(0, '#eb4d4b');
      grad.addColorStop(0.3, '#ff793f');
      grad.addColorStop(0.65, '#f0932b');
      grad.addColorStop(1, '#ffbe76');

      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#eb4d4b';
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(10, 0, 16, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();

      // Vẽ lưỡi lửa bốc lên trên thân cung
      const flameShift = Math.sin(now / 80) * 3;
      ctx.fillStyle = '#ffd32a';
      ctx.beginPath();
      ctx.moveTo(14, -3);
      ctx.lineTo(20 + flameShift, 0);
      ctx.lineTo(14, 3);
      ctx.fill();
      ctx.restore();

      // Hạt lửa bốc lên từ thân cung
      if (Math.random() < 0.12 && typeof game !== 'undefined' && game.particles) {
        const fx = pivotX + Math.cos(this.aimAngle) * 14 + (Math.random() - 0.5) * 8;
        const fy = pivotY + Math.sin(this.aimAngle) * 14 + (Math.random() - 0.5) * 8;
        game.particles.push(new Particle(fx, fy, (Math.random() - 0.5) * 25, -25 - Math.random() * 25, '#ff6b81', 3, 0.35, 'cinder'));
      }
    } else if (el === 'poison') {
      // Hệ Độc: Màu tím than pha xanh sẫm, liên tục nhỏ giọt
      const grad = ctx.createLinearGradient(6, -16, 18, 16);
      grad.addColorStop(0, '#2c2c54');
      grad.addColorStop(0.4, '#8854d0');
      grad.addColorStop(0.7, '#38ada9');
      grad.addColorStop(1, '#00d2d3');

      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#a55eea';
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4.0;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(10, 0, 16, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();

      // Mũi gai độc màu tím ngọc
      ctx.fillStyle = '#a55eea';
      ctx.beginPath();
      ctx.arc(10 + Math.cos(-Math.PI / 2.2) * 16, Math.sin(-Math.PI / 2.2) * 16, 3.2, 0, Math.PI * 2);
      ctx.arc(10 + Math.cos(Math.PI / 2.2) * 16, Math.sin(Math.PI / 2.2) * 16, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Giọt độc nhỏ xuống đất
      if (Math.random() < 0.1 && typeof game !== 'undefined' && game.particles) {
        const px = pivotX + Math.cos(this.aimAngle) * 12 + (Math.random() - 0.5) * 6;
        const py = pivotY + Math.sin(this.aimAngle) * 12 + (Math.random() - 0.5) * 6;
        game.particles.push(new Particle(px, py, (Math.random() - 0.5) * 15, 30 + Math.random() * 25, '#a55eea', 2.8, 0.4, 'poison_drip'));
      }
    } else if (el === 'water') {
      // Hệ Nước: Xanh dương trong vắt, đổ bóng bóng bẩy
      const grad = ctx.createLinearGradient(6, -16, 18, 16);
      grad.addColorStop(0, 'rgba(116, 185, 255, 0.9)');
      grad.addColorStop(0.5, 'rgba(9, 132, 227, 0.95)');
      grad.addColorStop(1, 'rgba(0, 206, 201, 0.9)');

      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#0984e3';
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(10, 0, 16, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();

      // Vệt sáng bóng bẩy phản chiếu mặt nước
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(8, 0, 14, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
      ctx.restore();

      // Bong bóng nhỏ bay lên từ cánh cung
      if (Math.random() < 0.1 && typeof game !== 'undefined' && game.particles) {
        const bx = pivotX + Math.cos(this.aimAngle) * 12;
        const by = pivotY + Math.sin(this.aimAngle) * 12;
        game.particles.push(new Particle(bx, by, (Math.random() - 0.5) * 20, -25 - Math.random() * 20, 'rgba(116, 185, 255, 0.8)', 3, 0.45, 'bubble'));
      }
    } else if (el === 'wind') {
      // Hệ Gió: Mờ ảo (alpha thấp), tỏa hào quang trắng lướt qua nhanh
      const grad = ctx.createLinearGradient(6, -16, 18, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.5, 'rgba(0, 210, 211, 0.85)');
      grad.addColorStop(1, 'rgba(223, 249, 251, 0.75)');

      ctx.save();
      ctx.globalAlpha = 0.65;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffffff';
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(10, 0, 16, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();

      // Đường cắt gió khí động học
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(13, 0, 12, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
      ctx.restore();
    } else {
      // Mặc định
      ctx.strokeStyle = '#8d6e63';
      ctx.lineWidth = 3.6;
      ctx.beginPath();
      ctx.arc(10, 0, 16, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();
    }

    // 2. DÂY CUNG NĂNG LƯỢNG KÉO CĂNG
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(10 + Math.cos(-Math.PI / 2.2) * 16, Math.sin(-Math.PI / 2.2) * 16);
    ctx.lineTo(10 - pullBack, 0);
    ctx.lineTo(10 + Math.cos(Math.PI / 2.2) * 16, Math.sin(Math.PI / 2.2) * 16);
    ctx.stroke();

    // 3. MŨI TÊN ĐANG ĐẶT TRÊN DÂY KHI TỤ LỰC
    if (this.isCharging || this.chargePower > 0) {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(10 - pullBack, 0);
      ctx.lineTo(28 - pullBack, 0);
      ctx.stroke();

      // Đầu mũi tên phát sáng khi tụ lực
      ctx.fillStyle = '#ffd32a';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff';
      ctx.beginPath();
      ctx.moveTo(28 - pullBack, 0);
      ctx.lineTo(23 - pullBack, -3.5);
      ctx.lineTo(23 - pullBack, 3.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  getArmorTierRank() {
    const t = [this.helmet ? this.helmet.tier : 'D', this.chest ? this.chest.tier : 'D', this.boots ? this.boots.tier : 'D'];
    if (t.includes('SSS')) return 'SSS';
    if (t.includes('SS')) return 'SS';
    if (t.includes('S')) return 'S';
    if (t.includes('A')) return 'A';
    return 'D';
  }

  getHelmetColor() {
    switch (this.helmet.tier) {
      case 'SSS': return '#ff9f43';
      case 'SS': return '#00d2d3';
      case 'S': return '#5f27cd';
      case 'A': return '#10ac84';
      default: return '#747d8c';
    }
  }

  getChestColor() {
    switch (this.chest.tier) {
      case 'SSS': return '#ee5253';
      case 'SS': return '#341f97';
      case 'S': return '#2e86de';
      case 'A': return '#10ac84';
      default: return this.id === 'p1' ? '#2ed573' : '#ff4757';
    }
  }

  getBootsColor() {
    switch (this.boots.tier) {
      case 'SSS': return '#ff9f43';
      case 'SS': return '#00d2d3';
      case 'S': return '#576574';
      case 'A': return '#8395a7';
      default: return '#2f3542';
    }
  }
}

// ============================================================================
// 9. QUẢN LÝ KẾT NỐI MẠNG WEBRTC FREE FOR ALL (TỐI ĐA 5 NGƯỜI)
// ============================================================================

const PLAYER_COLORS = {
  p1: '#2ed573', // Xanh ngọc lục bảo (Host)
  p2: '#ff4757', // Đỏ san hô
  p3: '#1e90ff', // Xanh dương
  p4: '#ffa502', // Vàng cam
  p5: '#9b59b6'  // Tím thạch anh
};

class NetworkManager {
  constructor(game) {
    this.game = game;
    this.peer = null;
    this.bc = null;
    this.isHost = false;
    this.isClient = false;
    this.inRoom = false;
    this.roomCode = '';
    this.myPlayerId = 'p1';
    this.myNickname = 'Chiến Binh 1';
    this.isReady = false;

    // Quản lý các Client kết nối tới Host: Map clientId -> { conn, id, name, equip, isReady }
    this.clients = new Map();

    // Kết nối từ Client tới Host
    this.hostConn = null;

    // Gói tin & ngắt trùng lặp
    this.receivedPacketIds = new Set();
    this.lastStateSyncTime = 0;

    // Trạng thái ngắm & di chuyển nội bộ của Client để phản hồi tức thời
    this.localAimAngle = -Math.PI * 0.4;
    this.localFacingRight = true;
  }

  init() {
    const btnCreate = document.getElementById('btn-create-room');
    const btnJoin = document.getElementById('btn-join-room');
    const btnCopy = document.getElementById('btn-copy-room-code');
    const btnLeave = document.getElementById('btn-leave-room');
    const btnReady = document.getElementById('btn-ready-toggle');
    const joinInput = document.getElementById('join-room-code-input');
    const nickInput = document.getElementById('player-nickname-input');

    if (nickInput) {
      nickInput.addEventListener('input', () => {
        this.myNickname = nickInput.value.trim() || 'Chiến Binh';
        this.onMyProfileChanged();
      });
    }

    if (btnCreate) {
      btnCreate.addEventListener('click', () => {
        sounds.init();
        this.createRoom();
      });
    }

    if (btnJoin) {
      btnJoin.addEventListener('click', () => {
        sounds.init();
        const code = joinInput ? joinInput.value.trim().toUpperCase() : '';
        if (code) this.joinRoom(code);
      });
    }

    if (joinInput) {
      joinInput.addEventListener('input', () => {
        joinInput.value = joinInput.value.toUpperCase();
      });

      joinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sounds.init();
          const code = joinInput.value.trim().toUpperCase();
          if (code) this.joinRoom(code);
        }
      });
    }

    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        if (!this.roomCode) return;
        navigator.clipboard.writeText(this.roomCode).then(() => {
          btnCopy.innerText = '✅ Đã Copy!';
          setTimeout(() => { btnCopy.innerText = '📋 Copy Mã'; }, 2000);
        }).catch(() => {
          btnCopy.innerText = '✅ Đã Copy!';
          setTimeout(() => { btnCopy.innerText = '📋 Copy Mã'; }, 2000);
        });
      });
    }

    const btnCopyLink = document.getElementById('btn-copy-room-link');
    if (btnCopyLink) {
      btnCopyLink.addEventListener('click', () => {
        if (!this.roomCode) return;
        const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${this.roomCode}`;
        navigator.clipboard.writeText(inviteUrl).then(() => {
          btnCopyLink.innerText = '✅ Đã Copy Link!';
          setTimeout(() => { btnCopyLink.innerText = '🔗 Copy Link Mời'; }, 2500);
        }).catch(() => {
          // Fallback nếu clipboard API bị chặn
          prompt('Copy link mời bên dưới gửi cho bạn bè:', inviteUrl);
          btnCopyLink.innerText = '🔗 Copy Link Mời';
        });
      });
    }

    // Tự động kiểm tra param ?room= trên URL để điền và tự động vào phòng
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryRoom = urlParams.get('room');
      if (queryRoom) {
        const cleanQueryRoom = queryRoom.trim().toUpperCase();
        if (joinInput) joinInput.value = cleanQueryRoom;
        // Chờ 500ms sau khi trang load xong thì tự động join phòng
        setTimeout(() => {
          console.log('Tự động tham gia phòng từ URL:', cleanQueryRoom);
          this.joinRoom(cleanQueryRoom);
        }, 600);
      }
    } catch (e) {
      console.warn('Lỗi đọc URL param room:', e);
    }

    if (btnLeave) {
      btnLeave.addEventListener('click', () => this.leaveRoom());
    }

    if (btnReady) {
      btnReady.addEventListener('click', () => this.toggleReady());
    }

    const btnAddBot = document.getElementById('btn-add-bot');
    const btnRemoveBot = document.getElementById('btn-remove-bot');
    if (btnAddBot) {
      btnAddBot.addEventListener('click', () => {
        sounds.init();
        this.addBot();
      });
    }
    if (btnRemoveBot) {
      btnRemoveBot.addEventListener('click', () => {
        sounds.init();
        this.removeBot();
      });
    }
  }

  logStatus(msg, type = 'info', badgeText = null, badgeClass = null) {
    console.log(`[NET-${type.toUpperCase()}] ${msg}`);
    const consoleEl = document.getElementById('net-log-console');
    if (consoleEl) {
      const timeStr = new Date().toLocaleTimeString('vi-VN', { hour12: false });
      const item = document.createElement('div');
      item.className = `log-item ${type}`;
      item.innerText = `[${timeStr}] ${msg}`;
      consoleEl.appendChild(item);
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    if (badgeText) {
      const badge = document.getElementById('net-conn-status-badge');
      if (badge) {
        badge.innerText = badgeText;
        badge.className = `net-status-badge ${badgeClass || 'badge-idle'}`;
      }
    }
  }

  generateRoomCode() {
    return 'AGY-' + Math.floor(1000 + Math.random() * 9000);
  }

  getPeerConfig() {
    return {
      debug: 2,
      config: {
        iceServers: [
          // STUN Google
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          // STUN Cloudflare & Twilio & Mozilla
          { urls: 'stun:stun.cloudflare.com:3478' },
          { urls: 'stun:global.stun.twilio.com:3478' },
          { urls: 'stun:stun.services.mozilla.com' },
          // TURN Server OpenRelay (hỗ trợ chuyển tiếp qua Internet / 4G / Wi-Fi khác nhau)
          {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          },
          {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          },
          {
            urls: 'turn:openrelay.metered.ca:443?transport=tcp',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          },
          {
            urls: 'turns:openrelay.metered.ca:443?transport=tcp',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          }
        ],
        iceTransportPolicy: 'all',
        iceCandidatePoolSize: 10
      }
    };
  }

  createRoom() {
    this.cleanup();
    const code = this.generateRoomCode();
    this.roomCode = code;
    this.isHost = true;
    this.isClient = false;
    this.inRoom = true;
    this.myPlayerId = 'p1';
    this.isReady = true;

    this.logStatus(`Đang khởi tạo phòng Host ${code}...`, 'info', '🟡 Đang kết nối PeerJS...', 'badge-connecting');

    // Cập nhật URL trình duyệt để phản ánh mã phòng
    if (window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', code);
      window.history.replaceState({}, '', url.toString());
    }

    this.setupBroadcastChannel(code);

    const cleanCode = code.toLowerCase().replace(/[^a-z0-9]/g, '');
    const peerId = `agy-ffa-${cleanCode}`;

    if (typeof Peer !== 'undefined') {
      try {
        this.logStatus(`Đăng ký Peer ID: ${peerId} với PeerJS Server...`, 'info');
        this.peer = new Peer(peerId, this.getPeerConfig());

        this.peer.on('open', (id) => {
          this.logStatus(`✅ Host mở phòng thành công! Peer ID: ${id}. Sẵn sàng đón người chơi khác IP.`, 'success', '🟢 Sẵn sàng nhận khách', 'badge-connected');
        });

        this.peer.on('connection', (conn) => {
          this.logStatus(`⚡ Có người chơi (Peer: ${conn.peer}) đang kết nối vào phòng...`, 'info');
          if (this.clients.size >= 4) {
            conn.on('open', () => {
              conn.send({ type: 'ROOM_FULL', message: 'Phòng đã đủ tối đa 5 người chơi!' });
              setTimeout(() => conn.close(), 500);
            });
            this.logStatus(`Phòng đã đủ 5 người, từ chối peer: ${conn.peer}`, 'warn');
            return;
          }
          this.handleIncomingClientConnection(conn);
        });

        this.peer.on('error', (err) => {
          this.logStatus(`❌ Lỗi PeerJS Host: [${err.type}] ${err.message || err}`, 'error', '🔴 Lỗi kết nối Host', 'badge-error');
        });

        this.peer.on('disconnected', () => {
          this.logStatus('⚠️ PeerJS Host bị ngắt kết nối với máy chủ báo hiệu. Đang thử kết nối lại...', 'warn');
          try { this.peer.reconnect(); } catch(e){}
        });
      } catch (e) {
        this.logStatus(`❌ Khởi tạo PeerJS thất bại: ${e.message}`, 'error', '🔴 Lỗi khởi tạo', 'badge-error');
      }
    } else {
      this.logStatus('❌ Không tìm thấy thư viện PeerJS! Hãy kiểm tra mạng internet.', 'error', '🔴 Thiếu PeerJS', 'badge-error');
    }

    this.showInRoomUI();
    this.updateLobbyRoomUI();
  }

  joinRoom(code) {
    if (!code) return;
    this.cleanup();
    this.roomCode = code;
    this.isHost = false;
    this.isClient = true;
    this.inRoom = true;
    this.isReady = false;

    this.logStatus(`Chuẩn bị vào phòng ${code}...`, 'info', '🟡 Đang kết nối Host...', 'badge-connecting');

    // Cập nhật URL trình duyệt
    if (window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', code);
      window.history.replaceState({}, '', url.toString());
    }

    this.setupBroadcastChannel(code);

    const cleanCode = code.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hostPeerId = `agy-ffa-${cleanCode}`;

    if (typeof Peer !== 'undefined') {
      try {
        this.peer = new Peer(this.getPeerConfig());

        this.peer.on('open', (myPeerId) => {
          this.logStatus(`Đã kết nối máy chủ báo hiệu. Client ID: ${myPeerId}. Bắt đầu liên kết tới Host (${hostPeerId})...`, 'info');
          const conn = this.peer.connect(hostPeerId, {
            reliable: true
          });
          this.setupClientConnection(conn);

          // Kiểm tra nếu sau 8s chưa vào được phòng thì thử kết nối lại
          setTimeout(() => {
            if (this.inRoom && this.isClient && (!this.myPlayerId || this.myPlayerId === 'p1')) {
              this.logStatus('⏳ Sau 8s WebRTC chưa mở, đang thử kết nối lại lần 2...', 'warn');
              if (this.peer && !this.peer.destroyed) {
                const retryConn = this.peer.connect(hostPeerId, { reliable: true });
                this.setupClientConnection(retryConn);
              }
            }
          }, 8000);
        });

        this.peer.on('error', (err) => {
          this.logStatus(`❌ Lỗi Client: [${err.type}] ${err.message || err}`, 'error', '🔴 Không thể vào phòng', 'badge-error');
          if (err.type === 'peer-unavailable') {
            alert('Không tìm thấy phòng ' + code + '! Hãy chắc chắn rằng Chủ phòng (Host) đang mở game.');
          }
        });

        this.peer.on('disconnected', () => {
          this.logStatus('⚠️ Client bị ngắt kết nối tạm thời với Peer server. Đang kết nối lại...', 'warn');
          try { this.peer.reconnect(); } catch(e){}
        });
      } catch (e) {
        this.logStatus(`❌ Client khởi tạo Peer thất bại: ${e.message}`, 'error', '🔴 Lỗi khởi tạo', 'badge-error');
      }
    } else {
      this.logStatus('❌ Không tìm thấy thư viện PeerJS!', 'error', '🔴 Thiếu PeerJS', 'badge-error');
    }

    // Gửi join qua BroadcastChannel phòng trường hợp cùng trình duyệt / khác tab
    setTimeout(() => {
      if (this.bc) {
        this.bc.postMessage({
          type: 'CLIENT_JOIN_REQUEST',
          nickname: this.myNickname,
          equip: this.getMyEquip()
        });
      }
    }, 300);

    this.showInRoomUI();
    this.updateLobbyRoomUI();
  }

  setupBroadcastChannel(code) {
    try {
      const channelName = `agy_bc_${code.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      this.bc = new BroadcastChannel(channelName);
      this.bc.onmessage = (e) => {
        this.handleMessage(e.data);
      };
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  }

  handleIncomingClientConnection(conn) {
    this.logStatus(`[Host] Đang kết nối WebRTC DataChannel với ${conn.peer}...`, 'info');

    conn.on('open', () => {
      this.logStatus(`[Host] ✅ Kết nối DataChannel đã MỞ (OPEN) với ${conn.peer}!`, 'success');
    });

    conn.on('data', (data) => {
      this.handleMessage(data, conn);
    });

    conn.on('error', (err) => {
      this.logStatus(`[Host] ❌ Lỗi DataConnection với ${conn.peer}: ${err.message || err}`, 'error');
    });

    conn.on('close', () => {
      this.logStatus(`[Host] 🔌 Người chơi (Peer ${conn.peer}) đã ngắt kết nối.`, 'warn');
      for (let [id, client] of this.clients.entries()) {
        if (client.conn === conn) {
          this.clients.delete(id);
          this.broadcastToClients({
            type: 'ROOM_PLAYERS_UPDATE',
            mapId: this.game.currentMapId,
            roomPlayers: this.getRoomPlayersList()
          });
          this.updateLobbyRoomUI();
          break;
        }
      }
    });
  }

  setupClientConnection(conn) {
    this.hostConn = conn;

    const doSendJoin = () => {
      if (this.hostConn && this.hostConn.open) {
        this.logStatus('Gửi yêu cầu tham gia phòng (CLIENT_JOIN_REQUEST)...', 'info');
        this.sendToHost({
          type: 'CLIENT_JOIN_REQUEST',
          nickname: this.myNickname,
          equip: this.getMyEquip()
        });
      }
    };

    conn.on('open', () => {
      this.logStatus('✅ Kết nối WebRTC tới Host đã MỞ (OPEN)! Đang tham gia sảnh...', 'success', '🟢 Kết nối Host thành công', 'badge-connected');
      doSendJoin();
      // Retry sau 500ms, 1000ms, 2000ms nếu chưa nhận được gán ID từ Host
      setTimeout(() => {
        if (!this.myPlayerId || this.myPlayerId === 'p1') doSendJoin();
      }, 500);
      setTimeout(() => {
        if (!this.myPlayerId || this.myPlayerId === 'p1') doSendJoin();
      }, 1000);
      setTimeout(() => {
        if (!this.myPlayerId || this.myPlayerId === 'p1') doSendJoin();
      }, 2000);
    });

    conn.on('data', (data) => {
      this.handleMessage(data);
    });

    conn.on('error', (err) => {
      this.logStatus(`❌ Lỗi kênh truyền Client: ${err.message || err}`, 'error', '🔴 Lỗi DataChannel', 'badge-error');
    });

    conn.on('close', () => {
      this.logStatus('🔌 Mất kết nối DataChannel với Host.', 'warn', '⚪ Đã ngắt kết nối', 'badge-idle');
      if (this.game.state === 'PLAYING') {
        alert('Mất kết nối với Chủ phòng (Host)! Đang trở về sảnh chờ...');
        this.game.goToLobby();
      }
      this.leaveRoom();
    });
  }

  getNextAvailableId() {
    const candidates = ['p2', 'p3', 'p4', 'p5'];
    for (let c of candidates) {
      if (!this.clients.has(c)) return c;
    }
    return null;
  }

  sendToHost(msg) {
    msg._id = `${Date.now()}_${Math.random()}`;
    msg.fromId = this.myPlayerId;

    if (this.hostConn && this.hostConn.open) {
      try { this.hostConn.send(msg); } catch(e){}
    }
    if (this.bc) {
      try { this.bc.postMessage(msg); } catch(e){}
    }
  }

  broadcastToClients(msg) {
    msg._id = `${Date.now()}_${Math.random()}`;
    this.clients.forEach(client => {
      if (client.conn && client.conn.open) {
        try { client.conn.send(msg); } catch(e){}
      }
    });
    if (this.bc) {
      try { this.bc.postMessage(msg); } catch(e){}
    }
  }

  handleMessage(msg, conn = null) {
    if (!msg || typeof msg !== 'object') return;

    if (msg._id) {
      if (this.receivedPacketIds.has(msg._id)) return;
      this.receivedPacketIds.add(msg._id);
      if (this.receivedPacketIds.size > 200) {
        const first = this.receivedPacketIds.values().next().value;
        this.receivedPacketIds.delete(first);
      }
    }

    if (this.isHost) {
      switch (msg.type) {
        case 'CLIENT_JOIN_REQUEST': {
          let clientId = null;
          for (let [id, c] of this.clients.entries()) {
            if (c.name === msg.nickname || c.conn === conn) {
              clientId = id;
              break;
            }
          }
          if (!clientId) {
            clientId = this.getNextAvailableId();
          }
          if (!clientId) {
            if (conn) conn.send({ type: 'ROOM_FULL', message: 'Phòng đã đủ 5 người!' });
            return;
          }

          this.clients.set(clientId, {
            conn: conn,
            id: clientId,
            name: msg.nickname || `Chiến Binh ${clientId.toUpperCase()}`,
            equip: msg.equip,
            isReady: false
          });

          const welcomePacket = {
            type: 'HOST_WELCOME',
            targetClientId: clientId,
            assignedId: clientId,
            mapId: this.game.currentMapId,
            roomPlayers: this.getRoomPlayersList()
          };
          if (conn && conn.open) {
            conn.send(welcomePacket);
          }
          if (this.bc) {
            this.bc.postMessage(welcomePacket);
          }

          this.broadcastToClients({
            type: 'ROOM_PLAYERS_UPDATE',
            mapId: this.game.currentMapId,
            roomPlayers: this.getRoomPlayersList()
          });

          this.updateLobbyRoomUI();
          break;
        }

        case 'CLIENT_SET_READY': {
          const client = this.clients.get(msg.fromId);
          if (client) {
            client.isReady = !!msg.isReady;
            if (msg.equip) client.equip = msg.equip;
            if (msg.nickname) client.name = msg.nickname;

            this.broadcastToClients({
              type: 'ROOM_PLAYERS_UPDATE',
              mapId: this.game.currentMapId,
              roomPlayers: this.getRoomPlayersList()
            });
            this.updateLobbyRoomUI();
          }
          break;
        }

        case 'CLIENT_UPDATE_EQUIP': {
          const client = this.clients.get(msg.fromId);
          if (client) {
            if (msg.equip) client.equip = msg.equip;
            if (msg.nickname) client.name = msg.nickname;
            this.broadcastToClients({
              type: 'ROOM_PLAYERS_UPDATE',
              mapId: this.game.currentMapId,
              roomPlayers: this.getRoomPlayersList()
            });
            this.updateLobbyRoomUI();
          }
          break;
        }

        case 'CLIENT_INPUT': {
          const player = this.game.players.find(p => p.id === msg.fromId);
          if (player && !player.isDead) {
            player.vx = msg.vx;
            player.setFacing(msg.facing);
            player.crouch(msg.crouch);
            player.aimAngle = msg.aimAngle;
          }
          break;
        }

        case 'CLIENT_JUMP': {
          const player = this.game.players.find(p => p.id === msg.fromId);
          if (player && !player.isDead) {
            player.jump();
          }
          break;
        }

        case 'CLIENT_CHARGE_START': {
          const player = this.game.players.find(p => p.id === msg.fromId);
          if (player && !player.isDead && !player.isCharging) {
            player.startCharge();
          }
          break;
        }

        case 'CLIENT_CHARGE_RELEASE': {
          const player = this.game.players.find(p => p.id === msg.fromId);
          if (player && !player.isDead) {
            player.releaseCharge(msg.power !== undefined ? msg.power : null);
          }
          break;
        }
      }
      return;
    }

    if (this.isClient) {
      switch (msg.type) {
        case 'ROOM_FULL':
          alert('Phòng đã đầy đủ 5 người chơi!');
          this.leaveRoom();
          break;

        case 'HOST_WELCOME':
          if (!msg.targetClientId || msg.targetClientId === this.myPlayerId || this.myPlayerId === 'p1') {
            this.myPlayerId = msg.assignedId || 'p2';
            this.logStatus(`🎉 Host đã chào đón! Bạn được gán vị trí: ${this.myPlayerId.toUpperCase()}.`, 'success', `🟢 Đã vào phòng (${this.myPlayerId.toUpperCase()})`, 'badge-connected');
            if (msg.mapId) {
              this.game.applyMapConfig(msg.mapId);
              this.highlightMapCard(msg.mapId);
            }
            this.renderRoomSlots(msg.roomPlayers);
            this.updateClientRoleUI();
          }
          break;

        case 'ROOM_PLAYERS_UPDATE':
          this.logStatus(`Đồng bộ danh sách phòng: ${msg.roomPlayers ? msg.roomPlayers.length : 1}/5 người.`, 'info');
          if (msg.mapId) {
            this.game.applyMapConfig(msg.mapId);
            this.highlightMapCard(msg.mapId);
          }
          this.renderRoomSlots(msg.roomPlayers);
          break;

        case 'ROOM_MAP_SYNC':
          if (msg.mapId) {
            this.game.applyMapConfig(msg.mapId);
            this.highlightMapCard(msg.mapId);
          }
          break;

        case 'START_MATCH':
          this.game.startMatchAsClient(msg);
          break;

        case 'MATCH_STATE_SYNC':
          this.game.applyMatchStateSync(msg);
          break;

        case 'MATCH_GAME_OVER':
          this.game.applyMatchGameOver(msg);
          break;

        case 'MATCH_REMATCH':
          this.game.startMatchAsClient(msg);
          break;

        case 'MATCH_RETURN_LOBBY':
          this.game.goToLobby();
          break;
      }
    }
  }

  toggleReady() {
    if (!this.isClient) return;
    this.isReady = !this.isReady;

    const btnReady = document.getElementById('btn-ready-toggle');
    if (btnReady) {
      if (this.isReady) {
        btnReady.innerText = '❌ HỦY SẴN SÀNG';
        btnReady.classList.add('is-ready');
      } else {
        btnReady.innerText = '✅ SẴN SÀNG CHIẾN ĐẤU';
        btnReady.classList.remove('is-ready');
      }
    }

    this.sendToHost({
      type: 'CLIENT_SET_READY',
      isReady: this.isReady,
      nickname: this.myNickname,
      equip: this.getMyEquip()
    });
  }

  onMyProfileChanged() {
    if (!this.inRoom) return;

    if (this.isHost) {
      this.broadcastToClients({
        type: 'ROOM_PLAYERS_UPDATE',
        mapId: this.game.currentMapId,
        roomPlayers: this.getRoomPlayersList()
      });
      this.updateLobbyRoomUI();
    } else if (this.isClient) {
      this.sendToHost({
        type: 'CLIENT_UPDATE_EQUIP',
        nickname: this.myNickname,
        equip: this.getMyEquip()
      });
    }
  }

  onHostMapSelect(mapId) {
    if (!this.isHost) return;
    this.broadcastToClients({
      type: 'ROOM_MAP_SYNC',
      mapId: mapId
    });
  }

  addBot() {
    if (!this.isHost) {
      alert('Chỉ Chủ Phòng (Host) mới có thể thêm Bot!');
      return;
    }
    const botId = this.getNextAvailableId();
    if (!botId) {
      alert('Phòng đã đầy tối đa 5 người chơi!');
      return;
    }

    const botNames = ['Bot Thiện Xạ', 'Bot Hỏa Long', 'Bot Băng Thần', 'Bot Lôi Thần', 'Bot Sát Thủ'];
    const botName = `🤖 ${botNames[Math.floor(Math.random() * botNames.length)]} (${botId.toUpperCase()})`;
    const randomW = WEAPONS[Math.floor(Math.random() * WEAPONS.length)];
    const randomH = ARMORS.helmet[Math.floor(Math.random() * ARMORS.helmet.length)];
    const randomC = ARMORS.chest[Math.floor(Math.random() * ARMORS.chest.length)];
    const randomB = ARMORS.boots[Math.floor(Math.random() * ARMORS.boots.length)];

    this.clients.set(botId, {
      conn: null,
      id: botId,
      name: botName,
      isBot: true,
      isReady: true,
      equip: {
        weaponId: randomW.id,
        helmId: randomH.id,
        chestId: randomC.id,
        bootsId: randomB.id
      }
    });

    this.broadcastToClients({
      type: 'ROOM_PLAYERS_UPDATE',
      mapId: this.game.currentMapId,
      roomPlayers: this.getRoomPlayersList()
    });
    this.updateLobbyRoomUI();
  }

  removeBot() {
    if (!this.isHost) return;
    let lastBotId = null;
    for (let [id, c] of this.clients.entries()) {
      if (c.isBot) lastBotId = id;
    }
    if (lastBotId) {
      this.clients.delete(lastBotId);
      this.broadcastToClients({
        type: 'ROOM_PLAYERS_UPDATE',
        mapId: this.game.currentMapId,
        roomPlayers: this.getRoomPlayersList()
      });
      this.updateLobbyRoomUI();
    }
  }

  getRoomPlayersList() {
    const list = [
      {
        id: 'p1',
        name: this.isHost ? (this.myNickname || 'Chủ Phòng') : 'Chủ Phòng',
        isHost: true,
        isReady: true,
        isBot: false,
        color: PLAYER_COLORS.p1,
        equip: this.isHost ? this.getMyEquip() : { weaponId: 'bow_sss_split', helmId: 'helm_sss', chestId: 'chest_sss', bootsId: 'boots_sss' }
      }
    ];

    if (this.isHost) {
      this.clients.forEach((client, id) => {
        list.push({
          id: id,
          name: client.name,
          isHost: false,
          isReady: !!client.isReady,
          isBot: !!client.isBot,
          color: PLAYER_COLORS[id] || '#ffa502',
          equip: client.equip
        });
      });
    }

    return list;
  }

  updateLobbyRoomUI() {
    if (!this.inRoom) return;

    const list = this.getRoomPlayersList();
    this.renderRoomSlots(list);

    const countBadge = document.getElementById('room-player-count-badge');
    if (countBadge) {
      countBadge.innerText = `👥 ${list.length}/5 Người Chơi`;
    }

    const startBtn = document.getElementById('btn-start-game');
    if (!startBtn) return;

    if (this.isHost) {
      const clientCount = this.clients.size;
      const allReady = clientCount >= 1 && Array.from(this.clients.values()).every(c => c.isReady);

      if (clientCount < 1) {
        startBtn.disabled = false;
        startBtn.innerText = '⚡ BẮT ĐẦU LUYỆN TẬP (HOẶC THÊM BOT / CHỜ BẠN)';
      } else if (!allReady) {
        const unreadyCount = Array.from(this.clients.values()).filter(c => !c.isReady).length;
        startBtn.disabled = true;
        startBtn.innerText = `⏳ Chờ tất cả Client bấm SẴN SÀNG (Còn ${unreadyCount} người)`;
      } else {
        startBtn.disabled = false;
        startBtn.innerText = `⚡ BẮT ĐẦU TRẬN HỖN CHIẾN (${clientCount + 1}/${clientCount + 1} ĐÃ SẴN SÀNG) ⚡`;
      }
    } else {
      startBtn.disabled = true;
      startBtn.innerText = '⏳ Đang chờ Chủ phòng (Host) bấm Bắt Đầu...';
    }
  }

  renderRoomSlots(roomPlayers = []) {
    const container = document.getElementById('room-slots-container');
    if (!container) return;

    container.innerHTML = '';
    const slots = ['p1', 'p2', 'p3', 'p4', 'p5'];

    slots.forEach((slotId, index) => {
      const p = roomPlayers.find(rp => rp.id === slotId);
      const card = document.createElement('div');
      card.className = `room-slot-card ${p ? 'occupied' : 'empty'}`;

      if (p) {
        const weaponObj = WEAPONS.find(w => w.id === (p.equip && p.equip.weaponId)) || WEAPONS[0];
        const roleText = p.isHost ? '👑 Host' : (p.isBot ? '🤖 Bot AI' : '🎮 Client');
        card.innerHTML = `
          <div class="slot-left">
            <div class="slot-avatar" style="background: ${p.color};">
              ${p.id.toUpperCase()}
            </div>
            <div class="slot-info">
              <div class="slot-name-row">
                <span class="slot-name">${p.name}</span>
                <span class="slot-role-tag ${p.isHost ? 'host' : ''}">${roleText}</span>
              </div>
              <span class="slot-equip-text">🏹 [${weaponObj.tier}] ${weaponObj.name}</span>
            </div>
          </div>
          <div class="slot-status-badge ${p.isReady ? 'ready' : 'unready'}">
            ${p.isHost ? '👑 Sẵn Sàng (Host)' : (p.isBot ? '🟢 Sẵn Sàng (Bot)' : (p.isReady ? '🟢 Đã Sẵn Sàng' : '⏳ Đang Chọn Đồ...'))}
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="slot-left">
            <div class="slot-avatar" style="background: #2f3542; border-color: rgba(255,255,255,0.2);">
              #${index + 1}
            </div>
            <div class="slot-info">
              <span class="slot-name" style="color: #a4b0be;">Vị trí trống</span>
              <span class="slot-equip-text" style="color: #747d8c;">Đang chờ người chơi kết nối...</span>
            </div>
          </div>
          <div class="slot-status-badge empty-text">
            Chờ Tham Gia
          </div>
        `;
      }
      container.appendChild(card);
    });
  }

  showInRoomUI() {
    const connectOptions = document.getElementById('room-connect-options');
    const roomInfoBar = document.getElementById('room-info-bar');
    const codeEl = document.getElementById('current-room-code');
    const roleBadge = document.getElementById('room-user-role-badge');
    const readyBox = document.getElementById('client-ready-box');
    const mapLabel = document.getElementById('map-select-label');

    if (connectOptions) connectOptions.classList.add('hidden');
    if (roomInfoBar) roomInfoBar.classList.remove('hidden');
    if (codeEl) codeEl.innerText = this.roomCode;

    if (this.isHost) {
      if (roleBadge) roleBadge.innerText = '👑 Bạn là Chủ Phòng (Host)';
      if (readyBox) readyBox.classList.add('hidden');
      if (mapLabel) mapLabel.innerText = '🗺️ CHỌN BẢN ĐỒ CHIẾN TRƯỜNG (BẠN LÀ CHỦ PHÒNG):';
    } else {
      if (roleBadge) roleBadge.innerText = '🎮 Bạn là Khách (Client)';
      if (readyBox) readyBox.classList.remove('hidden');
      if (mapLabel) mapLabel.innerText = '🗺️ BẢN ĐỒ THI ĐẤU (CHỦ PHÒNG QUYẾT ĐỊNH):';
    }
  }

  updateClientRoleUI() {
    const roleBadge = document.getElementById('room-user-role-badge');
    if (roleBadge) {
      roleBadge.innerText = `🎮 Khách (${this.myPlayerId.toUpperCase()})`;
    }
  }

  highlightMapCard(mapId) {
    document.querySelectorAll('.map-card').forEach(c => {
      if (c.getAttribute('data-map') === mapId) c.classList.add('active');
      else c.classList.remove('active');
    });
  }

  leaveRoom() {
    this.cleanup();
    this.inRoom = false;
    this.isHost = false;
    this.isClient = false;
    this.roomCode = '';
    this.myPlayerId = 'p1';
    this.isReady = false;

    const connectOptions = document.getElementById('room-connect-options');
    const roomInfoBar = document.getElementById('room-info-bar');
    const readyBox = document.getElementById('client-ready-box');
    const startBtn = document.getElementById('btn-start-game');

    if (connectOptions) connectOptions.classList.remove('hidden');
    if (roomInfoBar) roomInfoBar.classList.add('hidden');
    if (readyBox) readyBox.classList.add('hidden');

    if (startBtn) {
      startBtn.disabled = true;
      startBtn.innerText = '⏳ Vui lòng Tạo Phòng hoặc Vào Phòng để bắt đầu';
    }

    this.renderRoomSlots([]);
  }

  getMyEquip() {
    const wEl = document.getElementById('my-weapon-select');
    const hEl = document.getElementById('my-helmet-select');
    const cEl = document.getElementById('my-chest-select');
    const bEl = document.getElementById('my-boots-select');
    return {
      weaponId: wEl ? wEl.value : 'bow_sss_split',
      helmId: hEl ? hEl.value : 'helm_sss',
      chestId: cEl ? cEl.value : 'chest_ss',
      bootsId: bEl ? bEl.value : 'boots_s'
    };
  }

  cleanup() {
    this.clients.forEach(c => {
      try { if (c.conn) c.conn.close(); } catch(e){}
    });
    this.clients.clear();

    if (this.hostConn) {
      try { this.hostConn.close(); } catch(e){}
      this.hostConn = null;
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch(e){}
      this.peer = null;
    }
    if (this.bc) {
      try { this.bc.close(); } catch(e){}
      this.bc = null;
    }
  }
}

// ============================================================================
// 10. ĐIỀU KHIỂN BÀN PHÍM ĐỒNG NHẤT CHO MỌI NGƯỜI CHƠI
// Phím: A/D di chuyển (tự lật mặt), S cúi né, W nhảy x2,
// Mũi tên Trái/Phải chỉnh góc ngắm, Giữ Space tụ lực & nhả Space bắn.
// KHÔNG DÙNG CHUỘT ĐỂ NGẮM BẮN.
// ============================================================================

class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = {};
    this.initListeners();
  }

  initListeners() {
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) ||
          ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (e.target && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }

      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.key] = true;
      this.keys[e.code] = true;
      sounds.init();

      if (this.game.state !== 'PLAYING') return;

      // Nhảy W (nhấn lần 1 nhảy, nhấn lần 2 nhảy kép)
      if (e.key.toLowerCase() === 'w') {
        if (this.game.network.isHost) {
          const myChar = this.game.players.find(p => p.id === 'p1');
          if (myChar) myChar.jump();
        } else if (this.game.network.isClient) {
          this.game.network.sendToHost({ type: 'CLIENT_JUMP' });
        }
      }

      // Giữ Space tụ lực
      if (e.code === 'Space' && !this.keys['Space_Held']) {
        this.keys['Space_Held'] = true;
        if (this.game.network.isHost) {
          const myChar = this.game.players.find(p => p.id === 'p1');
          if (myChar && !myChar.isCharging) myChar.startCharge();
        } else if (this.game.network.isClient) {
          const myChar = this.game.players.find(p => p.id === this.game.network.myPlayerId);
          if (myChar) {
            const cost = myChar.getArrowEnergyCost();
            if (myChar.energy < cost) {
              sounds.playNoEnergy();
              this.game.floatingTexts.push(new FloatingText(myChar.x, myChar.y - 65, `⚡ HẾT NĂNG LƯỢNG! (Cần ${cost}⚡)`, '#ffd32a', 18, true));
              return;
            }
            if (!myChar.isCharging) myChar.startCharge();
          }
          this.game.network.sendToHost({ type: 'CLIENT_CHARGE_START' });
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.key] = false;
      this.keys[e.code] = false;

      if (this.game.state !== 'PLAYING') return;

      // Thả Space để bắn tên
      if (e.code === 'Space') {
        this.keys['Space_Held'] = false;
        if (this.game.network.isHost) {
          const myChar = this.game.players.find(p => p.id === 'p1');
          if (myChar) myChar.releaseCharge();
        } else if (this.game.network.isClient) {
          const myChar = this.game.players.find(p => p.id === this.game.network.myPlayerId);
          const pwr = myChar ? myChar.chargePower : 0;
          if (myChar) {
            myChar.isCharging = false;
            myChar.chargePower = 0;
          }
          this.game.network.sendToHost({ type: 'CLIENT_CHARGE_RELEASE', power: pwr });
        }
      }
    });
  }

  handleHostInput() {
    const p1 = this.game.players.find(p => p.id === 'p1');
    if (!p1 || p1.isDead) return;

    p1.vx = 0;
    if (this.keys['a']) {
      p1.vx = -1;
      p1.setFacing(false);
    }
    if (this.keys['d']) {
      p1.vx = 1;
      p1.setFacing(true);
    }

    p1.crouch(!!this.keys['s']);

    const angleSpeed = 0.04;
    if (this.keys['ArrowLeft'] || this.keys['arrowleft']) p1.aimAngle -= angleSpeed;
    if (this.keys['ArrowRight'] || this.keys['arrowright']) p1.aimAngle += angleSpeed;
  }

  handleClientInput() {
    if (!this.game.network.isClient) return;

    let vx = 0;
    let facing = this.game.network.localFacingRight;

    if (this.keys['a']) {
      vx = -1;
      if (facing) {
        facing = false;
        const sinA = Math.sin(this.game.network.localAimAngle);
        const cosA = Math.cos(this.game.network.localAimAngle);
        this.game.network.localAimAngle = Math.atan2(sinA, -cosA);
      }
    }
    if (this.keys['d']) {
      vx = 1;
      if (!facing) {
        facing = true;
        const sinA = Math.sin(this.game.network.localAimAngle);
        const cosA = Math.cos(this.game.network.localAimAngle);
        this.game.network.localAimAngle = Math.atan2(sinA, -cosA);
      }
    }
    this.game.network.localFacingRight = facing;

    const angleSpeed = 0.04;
    if (this.keys['ArrowLeft'] || this.keys['arrowleft']) this.game.network.localAimAngle -= angleSpeed;
    if (this.keys['ArrowRight'] || this.keys['arrowright']) this.game.network.localAimAngle += angleSpeed;

    const myChar = this.game.players.find(p => p.id === this.game.network.myPlayerId);
    if (myChar) {
      myChar.aimAngle = this.game.network.localAimAngle;
      myChar.facingRight = facing;
    }

    this.game.network.sendToHost({
      type: 'CLIENT_INPUT',
      vx: vx,
      facing: facing,
      crouch: !!this.keys['s'],
      aimAngle: this.game.network.localAimAngle
    });
  }
}

// ============================================================================
// 11. QUẢN LÝ TRẬN ĐẤU HỖN CHIẾN FREE FOR ALL (GAME MANAGER)
// ============================================================================

class GameManager {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.state = 'LOBBY';
    this.currentMapId = 'jungle';

    this.groundY = 620;
    this.gravity = 520;
    this.wind = 0;
    this.windChangeTimer = 0;

    // Danh sách tất cả người chơi trong trận hỗn chiến (Tối đa 5 người)
    this.players = [];

    this.platforms = [];
    this.pits = [];
    this.arrows = [];
    this.aoeZones = [];
    this.medikits = [];
    this.energyPacks = [];
    this.blindBags = [];
    this.particles = [];
    this.lightnings = [];
    this.floatingTexts = [];
    this.medikitSpawnTimer = 0;
    this.energyPackSpawnTimer = 0;
    this.blindBagSpawnTimer = 0;
    this.pendingHitEvents = [];

    // Hiệu ứng rung giật màn hình (Screen Shake)
    this.screenShakeTime = 0;
    this.screenShakeDuration = 0;
    this.screenShakeIntensity = 0;

    this.network = new NetworkManager(this);
    this.input = new InputHandler(this);

    this.lastTime = 0;
  }

  init() {
    this.applyMapConfig(this.currentMapId);
    this.setupLobbyUI();
    this.network.init();
    this.changeWind();
    this.renderPreview();

    requestAnimationFrame((ts) => this.loop(ts));
  }

  applyMapConfig(mapId) {
    this.currentMapId = mapId;
    const cfg = MAP_CONFIGS[mapId] || MAP_CONFIGS.jungle;
    this.platforms = cfg.platforms.map(p => ({ ...p }));
    this.pits = cfg.pits ? cfg.pits.map(p => ({ ...p })) : [];
  }

  isPit(x) {
    return false; // Hố đã được xóa hoàn toàn khỏi trò chơi
  }

  getCharacterById(id) {
    if (!this.players) return null;
    return this.players.find(p => p.id === id) || null;
  }

  checkGameOver() {
    this.checkFFAWinCondition();
  }

  recordHitEvent(evt) {
    this.pendingHitEvents.push(evt);
  }

  // KÍCH HOẠT HIỆU ỨNG RUNG MÀN HÌNH (SCREEN SHAKE)
  triggerScreenShake(duration = 0.25, intensity = 6) {
    this.screenShakeDuration = duration;
    this.screenShakeTime = duration;
    this.screenShakeIntensity = intensity;
  }

  // BÙNG NỔ HẠT VA CHẠM VÀ AOE THEO NGUYÊN TỐ (IMPACT & AOE PARTICLE SYSTEM)
  spawnElementalImpact(x, y, element, scale = 1) {
    const countMult = scale || 1;
    switch (element) {
      case 'ice': {
        this.triggerScreenShake(0.2, 4 * scale);
        // Bùng nổ hàng trăm tinh thể tuyết và mảnh băng sắc lạnh
        const total = Math.round(90 * countMult);
        for (let i = 0; i < total; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 60 + Math.random() * 280;
          const colors = ['#ffffff', '#dff9fb', '#70a1ff', '#c7ecee'];
          const col = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd - 30,
            col,
            2.5 + Math.random() * 3.5,
            0.4 + Math.random() * 0.45,
            'ice'
          ));
        }
        // Vệt sương lạnh bốc mờ
        for (let i = 0; i < 20; i++) {
          this.particles.push(new Particle(
            x, y,
            (Math.random() - 0.5) * 120,
            -Math.random() * 80 - 20,
            'rgba(223, 249, 251, 0.6)',
            6 + Math.random() * 8,
            0.5 + Math.random() * 0.3,
            'smoke'
          ));
        }
        this.particles.push(new Particle(x, y, 0, 0, '#70a1ff', 1, 0.45, 'shockwave'));
        break;
      }

      case 'lightning': {
        this.triggerScreenShake(0.25, 6 * scale);
        // Hàng chục tia sét lan truyền trên mặt đất & hạt tia lửa văng ra
        const total = Math.round(55 * countMult);
        for (let i = 0; i < total; i++) {
          const spd = 120 + Math.random() * 350;
          const angle = Math.random() * Math.PI * 2;
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd - 40,
            Math.random() < 0.5 ? '#fff200' : '#ffd32a',
            2.5 + Math.random() * 3.5,
            0.35 + Math.random() * 0.35,
            'spark'
          ));
        }
        // Các nhánh điện giật bò ngang trên mặt đất
        for (let i = 0; i < 14; i++) {
          const side = Math.random() < 0.5 ? -1 : 1;
          this.particles.push(new Particle(
            x, y - 4,
            side * (180 + Math.random() * 220),
            (Math.random() - 0.5) * 40,
            '#ffffff',
            3,
            0.3 + Math.random() * 0.25,
            'spark'
          ));
        }
        // Mini tia chớp đánh giật
        this.lightnings.push(new LightningBolt(x, y - 140, x, y, '#ffd32a', 6));
        this.lightnings.push(new LightningBolt(x - 30, y - 60, x + 35, y, '#ffffff', 4));
        this.particles.push(new Particle(x, y, 0, 0, '#ffd32a', 1, 0.4, 'shockwave'));
        break;
      }

      case 'fire': {
        this.triggerScreenShake(0.25, 6 * scale);
        const total = Math.round(75 * countMult);
        for (let i = 0; i < total; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 70 + Math.random() * 240;
          const colors = ['#ff4757', '#ffa502', '#ff6b81', '#ff793f'];
          const col = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd - 60,
            col,
            3.5 + Math.random() * 3.5,
            0.4 + Math.random() * 0.4,
            'cinder'
          ));
        }
        for (let i = 0; i < 22; i++) {
          this.particles.push(new Particle(
            x, y,
            (Math.random() - 0.5) * 110,
            -Math.random() * 90 - 30,
            '#2f3542',
            6 + Math.random() * 6,
            0.55 + Math.random() * 0.35,
            'smoke'
          ));
        }
        this.particles.push(new Particle(x, y, 0, 0, '#ff4757', 1, 0.45, 'shockwave'));
        break;
      }

      case 'explosion': {
        sounds.playExplosion();
        this.triggerScreenShake(0.38, 9 * scale);
        const total = Math.round(110 * countMult);
        // Vụ nổ hạt bung tỏa cực mạnh, tàn tro khói bụi bay mù mịt
        for (let i = 0; i < total; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 120 + Math.random() * 380;
          const colors = ['#ff3838', '#ff9f43', '#ffffff', '#ff5252', '#f39c12'];
          const col = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd - 50,
            col,
            3.5 + Math.random() * 4.5,
            0.4 + Math.random() * 0.5,
            'spark'
          ));
        }
        // Khói đen dày đặc
        for (let i = 0; i < 35; i++) {
          this.particles.push(new Particle(
            x, y,
            (Math.random() - 0.5) * 180,
            -Math.random() * 120 - 40,
            '#2d3436',
            8 + Math.random() * 10,
            0.6 + Math.random() * 0.4,
            'smoke'
          ));
        }
        this.particles.push(new Particle(x, y, 0, 0, '#ff3838', 1, 0.55, 'shockwave'));
        this.particles.push(new Particle(x, y, 0, 0, '#f39c12', 0.8, 0.4, 'shockwave'));
        break;
      }

      case 'poison': {
        this.triggerScreenShake(0.18, 4 * scale);
        const total = Math.round(65 * countMult);
        for (let i = 0; i < total; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 50 + Math.random() * 180;
          const colors = ['#a55eea', '#8e44ad', '#2ed573', '#6c5ce7'];
          const col = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd - 30,
            col,
            3.0 + Math.random() * 3.5,
            0.45 + Math.random() * 0.4,
            'poison_drip'
          ));
        }
        for (let i = 0; i < 20; i++) {
          this.particles.push(new Particle(
            x, y,
            (Math.random() - 0.5) * 90,
            -Math.random() * 60 - 20,
            '#a55eea',
            6 + Math.random() * 6,
            0.55 + Math.random() * 0.35,
            'smoke'
          ));
        }
        this.particles.push(new Particle(x, y, 0, 0, '#a55eea', 1, 0.4, 'shockwave'));
        break;
      }

      case 'water': {
        this.triggerScreenShake(0.16, 3.5 * scale);
        const total = Math.round(70 * countMult);
        for (let i = 0; i < total; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 60 + Math.random() * 220;
          const colors = ['#0984e3', '#74b9ff', '#00cec9', '#ffffff'];
          const col = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd - 40,
            col,
            3.0 + Math.random() * 3.5,
            0.4 + Math.random() * 0.4,
            'circle'
          ));
        }
        for (let i = 0; i < 25; i++) {
          this.particles.push(new Particle(
            x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 50,
            -40 - Math.random() * 50,
            'rgba(116, 185, 255, 0.85)',
            3.5 + Math.random() * 3,
            0.5 + Math.random() * 0.4,
            'bubble'
          ));
        }
        this.particles.push(new Particle(x, y, 0, 0, '#0984e3', 1, 0.45, 'shockwave'));
        break;
      }

      case 'wind': {
        this.triggerScreenShake(0.2, 5 * scale);
        const total = Math.round(55 * countMult);
        for (let i = 0; i < total; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 100 + Math.random() * 300;
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd - 30,
            Math.random() < 0.6 ? '#ffffff' : '#00d2d3',
            3.5 + Math.random() * 3.5,
            0.35 + Math.random() * 0.35,
            'wind_slash'
          ));
        }
        for (let i = 0; i < 20; i++) {
          this.particles.push(new Particle(
            x, y,
            (Math.random() - 0.5) * 120,
            -Math.random() * 70 - 20,
            '#c7ecee',
            5 + Math.random() * 5,
            0.4 + Math.random() * 0.3,
            'smoke'
          ));
        }
        this.particles.push(new Particle(x, y, 0, 0, '#ffffff', 1, 0.35, 'shockwave'));
        break;
      }

      case 'wood': {
        this.triggerScreenShake(0.18, 4 * scale);
        const total = Math.round(65 * countMult);
        for (let i = 0; i < total; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 50 + Math.random() * 200;
          const colors = ['#2ed573', '#10ac84', '#26de81', '#00b894'];
          const col = colors[Math.floor(Math.random() * colors.length)];
          this.particles.push(new Particle(
            x, y,
            Math.cos(angle) * spd,
            Math.sin(angle) * spd - 35,
            col,
            3.5 + Math.random() * 3.5,
            0.5 + Math.random() * 0.45,
            'leaf'
          ));
        }
        for (let i = 0; i < 20; i++) {
          this.particles.push(new Particle(
            x, y,
            (Math.random() - 0.5) * 90,
            (Math.random() - 0.5) * 90 - 20,
            '#7bed9f',
            3,
            0.4 + Math.random() * 0.3,
            'spark'
          ));
        }
        this.particles.push(new Particle(x, y, 0, 0, '#2ed573', 1, 0.4, 'shockwave'));
        break;
      }

      default: {
        this.triggerScreenShake(0.15, 3 * scale);
        for (let i = 0; i < 25; i++) {
          this.particles.push(new Particle(
            x, y,
            (Math.random() - 0.5) * 120,
            (Math.random() - 0.5) * 120 - 20,
            '#bdc581',
            3.5,
            0.35
          ));
        }
        break;
      }
    }
  }

  changeWind() {
    this.wind = (Math.random() - 0.5) * 240;
    this.windChangeTimer = 4 + Math.random() * 4;

    const arrowEl = document.getElementById('wind-arrow');
    const valEl = document.getElementById('wind-val');
    if (arrowEl && valEl) {
      const speed = Math.abs(this.wind / 20).toFixed(1);
      valEl.innerText = `${speed} m/s ${this.wind >= 0 ? '▶' : '◀'}`;
      arrowEl.style.transform = `rotate(${this.wind >= 0 ? 0 : 180}deg)`;
      arrowEl.style.color = Math.abs(this.wind) > 60 ? '#ff4757' : '#70a1ff';
    }
  }

  startMatchAsHost() {
    if (!this.network.isHost) return;

    this.applyMapConfig(this.currentMapId);
    const spawns = MAP_CONFIGS[this.currentMapId].spawns;
    const roomList = this.network.getRoomPlayersList();

    this.gameOverPending = false;
    this.players = roomList.map((rp, idx) => {
      const sp = spawns[idx] || { x: 180 + idx * 210, y: 520, facing: idx % 2 === 0 };
      const char = new Character(rp.id, rp.name, sp.x, sp.y, sp.facing, rp.color);
      char.isBot = !!rp.isBot;
      if (rp.equip) {
        char.weapon = WEAPONS.find(w => w.id === rp.equip.weaponId) || WEAPONS[0];
        char.helmet = ARMORS.helmet.find(a => a.id === rp.equip.helmId) || ARMORS.helmet[0];
        char.chest = ARMORS.chest.find(a => a.id === rp.equip.chestId) || ARMORS.chest[0];
        char.boots = ARMORS.boots.find(a => a.id === rp.equip.bootsId) || ARMORS.boots[0];
      }
      return char;
    });

    this.arrows = [];
    this.aoeZones = [];
    this.medikits = [];
    this.energyPacks = [];
    this.blindBags = [];
    this.particles = [];
    this.lightnings = [];
    this.floatingTexts = [];
    this.medikitSpawnTimer = 3;
    this.energyPackSpawnTimer = 5;
    this.blindBagSpawnTimer = 7;
    this.pendingHitEvents = [];

    // Gửi thông báo bắt đầu trận đấu cho tất cả Client
    this.network.broadcastToClients({
      type: 'START_MATCH',
      mapId: this.currentMapId,
      players: roomList
    });

    this.state = 'PLAYING';
    this.transitionToCombatScreen();
    this.renderCombatHUD();
    this.changeWind();
  }

  startMatchAsClient(msg) {
    this.applyMapConfig(msg.mapId || this.currentMapId);
    const spawns = MAP_CONFIGS[this.currentMapId].spawns;
    const roomList = msg.players || msg.roomPlayers || [];

    this.gameOverPending = false;
    this.players = roomList.map((rp, idx) => {
      const sp = spawns[idx] || { x: 180 + idx * 210, y: 520, facing: idx % 2 === 0 };
      const char = new Character(rp.id, rp.name, sp.x, sp.y, sp.facing, rp.color);
      char.isBot = !!rp.isBot;
      if (rp.equip) {
        char.weapon = WEAPONS.find(w => w.id === rp.equip.weaponId) || WEAPONS[0];
        char.helmet = ARMORS.helmet.find(a => a.id === rp.equip.helmId) || ARMORS.helmet[0];
        char.chest = ARMORS.chest.find(a => a.id === rp.equip.chestId) || ARMORS.chest[0];
        char.boots = ARMORS.boots.find(a => a.id === rp.equip.bootsId) || ARMORS.boots[0];
      }
      return char;
    });

    this.arrows = [];
    this.aoeZones = [];
    this.medikits = [];
    this.energyPacks = [];
    this.blindBags = [];
    this.particles = [];
    this.lightnings = [];
    this.floatingTexts = [];

    this.state = 'PLAYING';
    this.transitionToCombatScreen();
    this.renderCombatHUD();
  }

  transitionToCombatScreen() {
    document.getElementById('lobby-screen').classList.remove('active');
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('gameover-modal').classList.add('hidden');
    document.getElementById('combat-hud').classList.remove('hidden');
    document.getElementById('combat-hud').classList.add('active');
  }

  renderCombatHUD() {
    const container = document.getElementById('ffa-huds-wrapper');
    if (!container) return;
    container.innerHTML = '';

    this.players.forEach(p => {
      const card = document.createElement('div');
      card.className = `player-hud ffa-player-card ${p.isDead ? 'eliminated' : ''}`;
      card.id = `ffa-hud-${p.id}`;

      const weaponName = p.weapon ? p.weapon.name : 'Cung';
      const weaponTier = p.weapon ? p.weapon.tier : 'A';
      const hDef = p.helmet ? p.helmet.defPercent : 0;
      const cDef = p.chest ? p.chest.defPercent : 0;
      const bDef = p.boots ? p.boots.defPercent : 0;

      card.innerHTML = `
        <div class="hud-avatar" style="background: ${p.color};">
          ${p.id.toUpperCase()}
        </div>
        <div class="hud-info">
          <div class="hud-name-row">
            <span class="hud-name" title="${p.name}">${p.name}</span>
            <span class="hud-weapon-badge">${weaponName} (${weaponTier})</span>
          </div>
          <div class="hp-bar-outer">
            <div class="hp-bar-fill" id="${p.id}-hp-fill" style="width: 100%; background: ${p.color};"></div>
            <span class="hp-text" id="${p.id}-hp-text">${Math.ceil(p.hp)} / ${p.maxHp}</span>
          </div>
          <div class="energy-bar-outer">
            <div class="energy-bar-fill" id="${p.id}-energy-fill" style="width: 100%;"></div>
            <span class="energy-text" id="${p.id}-energy-text">${Math.ceil(p.energy)} / ${p.maxEnergy} ⚡</span>
          </div>
          <div class="hud-stats-row">
            <span id="${p.id}-stat-def" title="Giảm ST Đầu / Thân / Chân">🛡️ Đ-${hDef}% T-${cDef}% C-${bDef}%</span>
            <span id="${p.id}-stat-aim">🎯 0°</span>
          </div>
          <div class="status-tags" id="${p.id}-status-tags"></div>
          <div class="eliminated-badge">💀 ĐÃ BỊ HẠ GỤC</div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min(0.08, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame((ts) => this.loop(ts));
  }

  update(dt) {
    if (this.screenShakeTime > 0) {
      this.screenShakeTime = Math.max(0, this.screenShakeTime - dt);
    }

    if (this.state !== 'PLAYING') return;

    if (this.network.isClient) {
      this.input.handleClientInput();

      this.particles.forEach(p => p.update(dt));
      this.particles = this.particles.filter(p => p.life > 0);

      this.lightnings.forEach(l => l.update(dt));
      this.lightnings = this.lightnings.filter(l => l.life > 0);

      this.floatingTexts.forEach(t => t.update(dt));
      this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);

      this.updateCombatHUD();
      return;
    }

    // ================= MÁY CHỦ (HOST AUTHORITATIVE SIMULATION) =================
    this.windChangeTimer -= dt;
    if (this.windChangeTimer <= 0) {
      this.changeWind();
    }

    this.input.handleHostInput();

    // Cập nhật trí tuệ nhân tạo Bot (AI)
    this.updateBotAIs(dt);

    // Cập nhật tất cả người chơi
    this.players.forEach(p => p.update(dt, this.groundY, this.platforms));

    // Sinh hộp cứu thương
    this.medikitSpawnTimer -= dt;
    if (this.medikitSpawnTimer <= 0) {
      const spawnX = 200 + Math.random() * 880;
      this.medikits.push(new Medikit(spawnX, -50));
      this.medikitSpawnTimer = 12 + Math.random() * 10;
    }

    this.medikits.forEach(box => {
      box.update(dt, this.groundY, this.platforms);
      if (box.active) {
        for (let p of this.players) {
          if (!p.isDead && p.defeatState === 'ALIVE' && this.checkCollisionBox(p, box)) {
            p.heal(250);
            this.floatingTexts.push(new FloatingText(p.x, p.y - 60, '+250 HP (Cứu Thương)', '#2ed573', 22));
            box.active = false;
            break;
          }
        }
      }
    });
    this.medikits = this.medikits.filter(b => b.active);

    // Sinh gói năng lượng tiếp tế (Energy Pack Supply Drop)
    this.energyPackSpawnTimer -= dt;
    if (this.energyPackSpawnTimer <= 0) {
      const spawnX = 180 + Math.random() * 920;
      this.energyPacks.push(new EnergyPack(spawnX, -50));
      this.energyPackSpawnTimer = 10 + Math.random() * 10;
    }

    this.energyPacks.forEach(pack => {
      pack.update(dt, this.groundY, this.platforms);
      if (pack.active) {
        for (let p of this.players) {
          if (!p.isDead && p.defeatState === 'ALIVE' && this.checkCollisionBox(p, pack)) {
            p.addEnergy(pack.energyAmount);
            sounds.playEnergyPickup();
            this.floatingTexts.push(new FloatingText(p.x, p.y - 60, `+${pack.energyAmount} NĂNG LƯỢNG ⚡`, '#00d2d3', 22, true));
            for (let i = 0; i < 14; i++) {
              this.particles.push(new Particle(p.x, p.y - 25, (Math.random()-0.5)*110, (Math.random()-0.5)*110, '#00d2d3', 3.5, 0.4, 'spark'));
            }
            pack.active = false;
            break;
          }
        }
      }
    });
    this.energyPacks = this.energyPacks.filter(p => p.active);

    // Sinh Túi Mù Kỳ Bí Tiếp Tế (Blind Bag Supply Drop)
    this.blindBagSpawnTimer -= dt;
    if (this.blindBagSpawnTimer <= 0) {
      const spawnX = 180 + Math.random() * 920;
      this.blindBags.push(new BlindBag(spawnX, -50));
      this.blindBagSpawnTimer = 11 + Math.random() * 8;
    }

    this.blindBags.forEach(bag => {
      bag.update(dt, this.groundY, this.platforms);
      if (bag.active) {
        for (let p of this.players) {
          if (!p.isDead && p.defeatState === 'ALIVE' && this.checkCollisionBox(p, bag)) {
            this.openBlindBag(p, bag);
            break;
          }
        }
      }
    });
    this.blindBags = this.blindBags.filter(b => b.active);

    // Cập nhật mũi tên
    this.arrows.forEach(arrow => {
      arrow.update(dt, this.wind, this.gravity);
      if (arrow.active) {
        this.checkArrowCollisions(arrow);
      }
    });
    this.arrows = this.arrows.filter(a => a.active && a.y < 850 && a.x > -100 && a.x < 1380);

    // Cập nhật các vùng hiệu ứng lan (AoE)
    this.aoeZones.forEach(z => z.update(dt));
    this.aoeZones = this.aoeZones.filter(z => z.life > 0);

    this.particles.forEach(p => p.update(dt));
    this.particles = this.particles.filter(p => p.life > 0);

    this.lightnings.forEach(l => l.update(dt));
    this.lightnings = this.lightnings.filter(l => l.life > 0);

    this.floatingTexts.forEach(t => t.update(dt));
    this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);

    this.updateCombatHUD();

    // Kiểm tra kết thúc trận đấu hỗn chiến
    this.checkFFAWinCondition();

    // Gửi snapshot trạng thái mượt mà cho tất cả Client
    this.broadcastMatchStateSync();
  }

  // MỞ TÚI MÙ TIẾP TẾ: BOOM SÁT THƯƠNG / HỒI MÁU / HỒI NĂNG LƯỢNG
  openBlindBag(player, bag) {
    bag.active = false;
    const roll = Math.random();

    if (roll < 0.33) {
      // 1. BOOM NỔ GÂY SÁT THƯƠNG
      const bombDmg = 250;
      player.hp = Math.max(0, player.hp - bombDmg);
      player.vy = -380;
      player.vx += (Math.random() - 0.5) * 240;
      sounds.playExplosion();

      this.floatingTexts.push(new FloatingText(player.x, player.y - 65, `💣 BOOM! TÚI MÙ PHÁT NỔ! -${bombDmg} HP`, '#ff4757', 22, true));
      for (let i = 0; i < 35; i++) {
        this.particles.push(new Particle(
          bag.x + bag.width / 2, bag.y + bag.height / 2,
          (Math.random() - 0.5) * 260,
          (Math.random() - 0.5) * 260 - 40,
          i % 2 === 0 ? '#ff4757' : '#ffa502', 5.5, 0.5, 'spark'
        ));
      }
      this.particles.push(new Particle(bag.x + bag.width / 2, bag.y + bag.height / 2, 0, 0, '#ffffff', 1, 0.45, 'shockwave'));

      if (player.hp <= 0) {
        player.triggerDefeat();
      }
    } else if (roll < 0.66) {
      // 2. HỒI MÁU THẦN TỐC
      const healAmt = 300;
      player.heal(healAmt);
      sounds.playHeal();
      this.floatingTexts.push(new FloatingText(player.x, player.y - 65, `💖 TÚI MÙ: HỒI +${healAmt} MÁU!`, '#2ed573', 22, true));
      for (let i = 0; i < 20; i++) {
        this.particles.push(new Particle(
          player.x, player.y - 25,
          (Math.random() - 0.5) * 110,
          (Math.random() - 0.5) * 110 - 25,
          '#2ed573', 4.5, 0.5, 'spark'
        ));
      }
    } else {
      // 3. HỒI NĂNG LƯỢNG ĐẦY BÌNH
      const energyAmt = 60;
      player.addEnergy(energyAmt);
      sounds.playEnergyPickup();
      this.floatingTexts.push(new FloatingText(player.x, player.y - 65, `⚡ TÚI MÙ: HỒI +${energyAmt} NĂNG LƯỢNG!`, '#00d2d3', 22, true));
      for (let i = 0; i < 20; i++) {
        this.particles.push(new Particle(
          player.x, player.y - 25,
          (Math.random() - 0.5) * 110,
          (Math.random() - 0.5) * 110 - 25,
          '#00d2d3', 4.5, 0.5, 'spark'
        ));
      }
    }
  }

  updateBotAIs(dt) {
    if (!this.network.isHost) return;

    this.players.forEach(p => {
      if (!p.isBot || p.isDead || p.defeatState !== 'ALIVE') return;

      if (!p.botAiState) {
        p.botAiState = {
          thinkTimer: 0.2 + Math.random() * 0.5,
          shootTimer: 1.2 + Math.random() * 1.5,
          desiredPower: 50,
          moveTimer: 0,
          moveDir: 0
        };
      }

      const ai = p.botAiState;
      ai.thinkTimer -= dt;
      ai.shootTimer -= dt;
      ai.moveTimer -= dt;

      // Tìm mục tiêu kẻ địch còn sống gần nhất
      const enemies = this.players.filter(o => o.id !== p.id && !o.isDead && o.defeatState === 'ALIVE');
      if (enemies.length === 0) {
        p.vx = 0;
        return;
      }

      let nearest = enemies[0];
      let minDist = Math.hypot(nearest.x - p.x, nearest.y - p.y);
      for (let i = 1; i < enemies.length; i++) {
        const d = Math.hypot(enemies[i].x - p.x, enemies[i].y - p.y);
        if (d < minDist) {
          minDist = d;
          nearest = enemies[i];
        }
      }

      // Quay mặt về phía mục tiêu
      const shouldFaceRight = nearest.x >= p.x;
      if (p.facingRight !== shouldFaceRight) {
        p.setFacing(shouldFaceRight);
      }

      // Căn góc nhắm theo quỹ đạo vòng cung có bù trừ trọng lực
      const dx = nearest.x - p.x;
      const dy = (nearest.y - 25) - (p.y - 30);
      const dist = Math.hypot(dx, dy);

      const directAngle = Math.atan2(dy, dx);
      // Nâng góc bắn cao hơn một chút theo khoảng cách
      const arcAdjustment = -Math.min(0.42, (dist / 1400) * 0.45);
      p.aimAngle = directAngle + arcAdjustment;

      // Di chuyển ngẫu nhiên
      if (ai.moveTimer <= 0) {
        ai.moveTimer = 1.2 + Math.random() * 2.0;
        const r = Math.random();
        if (r < 0.35) ai.moveDir = -1;
        else if (r < 0.7) ai.moveDir = 1;
        else ai.moveDir = 0;

        if (Math.random() < 0.3 && p.isGrounded) {
          p.jump();
        }
      }
      p.vx = ai.moveDir;

      // Tụ lực và bắn
      if (ai.shootTimer <= 0) {
        if (!p.isCharging) {
          ai.desiredPower = Math.min(100, Math.max(25, (dist / 950) * 80 + (Math.random() - 0.5) * 15));
          p.startCharge();
        } else {
          if (p.chargePower >= ai.desiredPower) {
            p.releaseCharge();
            ai.shootTimer = 1.8 + Math.random() * 2.0;
          }
        }
      }
    });
  }

  checkCollisionBox(char, box) {
    return (
      char.x + char.width / 2 > box.x &&
      char.x - char.width / 2 < box.x + box.width &&
      char.y > box.y &&
      char.y - char.height < box.y + box.height
    );
  }

  arrowIntersectsBox(arrow, box) {
    if (!box || box.width <= 0 || box.height <= 0) return false;
    if (this.pointInRect(arrow.x, arrow.y, box)) return true;
    const cos = Math.cos(arrow.angle);
    const sin = Math.sin(arrow.angle);
    const midX = arrow.x - cos * 13;
    const midY = arrow.y - sin * 13;
    if (this.pointInRect(midX, midY, box)) return true;
    const tailX = arrow.x - cos * 26;
    const tailY = arrow.y - sin * 26;
    if (this.pointInRect(tailX, tailY, box)) return true;
    return false;
  }

  checkArrowCollisions(arrow) {
    for (let plat of this.platforms) {
      if (this.arrowIntersectsBox(arrow, plat)) {
        arrow.active = false;
        sounds.playObstacleHit();
        const elem = arrow.weapon ? arrow.weapon.element : 'none';
        this.aoeZones.push(new AoEZone(arrow.x, arrow.y, elem, arrow.owner));
        this.spawnElementalImpact(arrow.x, arrow.y, elem, 0.9);
        return;
      }
    }

    // Hỗn chiến Free For All: Mũi tên gây sát thương lên bất kỳ người chơi nào còn sống
    for (let target of this.players) {
      if (target.isDead || target.defeatState !== 'ALIVE' || target.id === arrow.owner) continue;
      const hitboxes = target.getHitboxes();

      if (this.arrowIntersectsBox(arrow, hitboxes.head)) {
        target.takeDamage(arrow, 'head');
        arrow.active = false;
        return;
      }
      if (this.arrowIntersectsBox(arrow, hitboxes.body)) {
        target.takeDamage(arrow, 'body');
        arrow.active = false;
        return;
      }
      if (this.arrowIntersectsBox(arrow, hitboxes.limbs)) {
        target.takeDamage(arrow, 'limbs');
        arrow.active = false;
        return;
      }
    }

    // Chạm sàn đất vững chắc: Không có hố, đạn luôn kích hoạt hiệu ứng chạm sàn
    if (arrow.y >= this.groundY) {
      arrow.active = false;
      const elem = arrow.weapon ? arrow.weapon.element : 'none';
      this.aoeZones.push(new AoEZone(arrow.x, this.groundY, elem, arrow.owner));
      this.spawnElementalImpact(arrow.x, this.groundY, elem, 1.0);
    }
  }

  pointInRect(px, py, rect) {
    return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  }

  checkFFAWinCondition() {
    if (this.state !== 'PLAYING') return;

    const alivePlayers = this.players.filter(p => !p.isDead && p.hp > 0 && p.defeatState === 'ALIVE');

    // Nếu trận đấu ban đầu có >= 2 người: Chỉ kết thúc khi còn đúng 1 người hoặc 0 người sống sót
    if (this.players.length >= 2) {
      if (alivePlayers.length <= 1) {
        if (this.gameOverPending) return;
        this.gameOverPending = true;

        setTimeout(() => {
          if (this.state !== 'PLAYING') return;
          this.state = 'GAMEOVER';
          sounds.playVictory();

          const winner = alivePlayers.length === 1 ? alivePlayers[0] : null;
          const leaderboard = this.buildLeaderboardData(winner);

          // Hiển thị modal trên Host
          this.showLeaderboardModal(leaderboard);

          // Gửi kết quả cho tất cả Client
          this.network.broadcastToClients({
            type: 'MATCH_GAME_OVER',
            leaderboard: leaderboard
          });
        }, 1600);
      }
    } else if (this.players.length === 1) {
      // Chế độ luyện tập 1 mình: chỉ kết thúc khi người chơi gục ngã (HP = 0)
      if (alivePlayers.length === 0) {
        if (this.gameOverPending) return;
        this.gameOverPending = true;

        setTimeout(() => {
          if (this.state !== 'PLAYING') return;
          this.state = 'GAMEOVER';
          sounds.playVictory();
          const leaderboard = this.buildLeaderboardData(null);
          this.showLeaderboardModal(leaderboard);
        }, 1600);
      }
    }
  }

  buildLeaderboardData(winner) {
    // Sắp xếp: Người thắng đứng đầu, các người còn lại xếp theo sát thương gây ra
    const sorted = [...this.players].sort((a, b) => {
      if (winner && a.id === winner.id) return -1;
      if (winner && b.id === winner.id) return 1;
      return b.totalDamageDealt - a.totalDamageDealt;
    });

    return sorted.map((p, index) => {
      const acc = p.shotsFired > 0 ? Math.round((p.hitsLanded / p.shotsFired) * 100) : 0;
      const isWinner = winner && p.id === winner.id;
      return {
        rank: index + 1,
        id: p.id,
        name: p.name,
        color: p.color,
        damage: p.totalDamageDealt,
        shots: p.shotsFired,
        hits: p.hitsLanded,
        accuracy: acc,
        isWinner: isWinner,
        status: isWinner ? '🏆 CHIẾN THẮNG' : '💀 BỊ HẠ GỤC'
      };
    });
  }

  showLeaderboardModal(leaderboard) {
    const winnerEntry = leaderboard.find(e => e.isWinner);
    const titleEl = document.getElementById('winner-title');
    if (titleEl) {
      titleEl.innerText = winnerEntry
        ? `🎉 ${winnerEntry.name} CHIẾN THẮNG!`
        : 'HÒA NHAU KHÔNG PHÂN THẮNG BẠI!';
    }

    const tbody = document.getElementById('leaderboard-body');
    if (tbody) {
      tbody.innerHTML = '';
      leaderboard.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="rank-badge rank-${entry.rank}">#${entry.rank}</span></td>
          <td><strong style="color: ${entry.color}">${entry.name}</strong></td>
          <td><strong style="color: #ff6b81">${entry.damage}</strong></td>
          <td>${entry.hits} / ${entry.shots}</td>
          <td><strong style="color: #2ed573">${entry.accuracy}%</strong></td>
          <td><strong>${entry.status}</strong></td>
        `;
        tbody.appendChild(tr);
      });
    }

    document.getElementById('gameover-modal').classList.remove('hidden');
    document.getElementById('gameover-modal').classList.add('active');
  }

  broadcastMatchStateSync() {
    if (!this.network.isHost) return;

    const now = Date.now();
    if (now - this.lastStateSyncTime < 25) return;
    this.lastStateSyncTime = now;

    const eventsToSend = [...this.pendingHitEvents];
    this.pendingHitEvents = [];

    this.network.broadcastToClients({
      type: 'MATCH_STATE_SYNC',
      wind: this.wind,
      hitEvents: eventsToSend,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        x: p.x,
        y: p.y,
        vx: p.vx,
        vy: p.vy,
        hp: p.hp,
        maxHp: p.maxHp,
        energy: p.energy,
        maxEnergy: p.maxEnergy,
        color: p.color,
        facing: p.facingRight,
        crouch: p.isCrouching,
        charging: p.isCharging,
        chargePower: p.chargePower,
        aimAngle: p.aimAngle,
        status: { ...p.statusEffects },
        defeatState: p.defeatState,
        deathOpacity: p.deathOpacity,
        collapseAngle: p.collapseAngle,
        shotsFired: p.shotsFired,
        hitsLanded: p.hitsLanded,
        totalDamageDealt: p.totalDamageDealt,
        isDead: p.isDead,
        isBot: !!p.isBot,
        weaponId: p.weapon ? p.weapon.id : 'bow_a_basic',
        helmId: p.helmet ? p.helmet.id : 'helm_a',
        chestId: p.chest ? p.chest.id : 'chest_a',
        bootsId: p.boots ? p.boots.id : 'boots_a'
      })),
      arrows: this.arrows.map(a => ({
        x: a.x,
        y: a.y,
        vx: a.vx,
        vy: a.vy,
        angle: a.angle,
        element: a.weapon.element,
        tier: a.weapon.tier,
        owner: a.owner,
        isBoomerang: a.isBoomerang,
        isReturning: a.isReturning
      })),
      aoe: this.aoeZones.map(z => ({
        x: z.x,
        y: z.y,
        radius: z.radius,
        element: z.element,
        owner: z.owner,
        life: z.life,
        maxLife: z.maxLife
      })),
      medikits: this.medikits.map(m => ({
        x: m.x,
        y: m.y,
        active: m.active
      })),
      energyPacks: this.energyPacks.map(e => ({
        x: e.x,
        y: e.y,
        active: e.active
      })),
      blindBags: this.blindBags.map(b => ({
        x: b.x,
        y: b.y,
        active: b.active
      }))
    });
  }

  applyMatchStateSync(msg) {
    if (this.state !== 'PLAYING') return;

    this.wind = msg.wind;
    const arrowEl = document.getElementById('wind-arrow');
    const valEl = document.getElementById('wind-val');
    if (arrowEl && valEl) {
      const speed = Math.abs(this.wind / 20).toFixed(1);
      valEl.innerText = `${speed} m/s ${this.wind >= 0 ? '▶' : '◀'}`;
      arrowEl.style.transform = `rotate(${this.wind >= 0 ? 0 : 180}deg)`;
      arrowEl.style.color = Math.abs(this.wind) > 60 ? '#ff4757' : '#70a1ff';
    }

    if (msg.hitEvents && msg.hitEvents.length > 0) {
      msg.hitEvents.forEach(evt => {
        const target = this.players.find(p => p.id === evt.targetId);
        if (target) {
          target.hurtTimer = 0.25;
        }
        sounds.playHit(evt.hitbox);
        const textPrefix = evt.isCrit ? '💥 CRIT! -' : '-';
        const textColor = evt.isCrit ? '#ff4757' : (evt.hitbox === 'body' ? '#ffa502' : '#f1f2f6');
        this.floatingTexts.push(new FloatingText(evt.x, evt.y - 15, `${textPrefix}${evt.damage}`, textColor, evt.isCrit ? 24 : 18, evt.isCrit));
        this.spawnElementalImpact(evt.x, evt.y, evt.element || 'none', evt.isCrit ? 1.4 : 1.05);
      });
    }

    if (msg.players) {
      let needsHudRerender = false;
      msg.players.forEach(sp => {
        let p = this.players.find(x => x.id === sp.id);
        if (!p) {
          p = new Character(sp.id, sp.name, sp.x, sp.y, sp.facing, sp.color);
          this.players.push(p);
          needsHudRerender = true;
        }
        p.isBot = !!sp.isBot;
        if (sp.weaponId && (!p.weapon || p.weapon.id !== sp.weaponId)) {
          p.weapon = WEAPONS.find(w => w.id === sp.weaponId) || p.weapon;
        }
        if (sp.helmId && (!p.helmet || p.helmet.id !== sp.helmId)) {
          p.helmet = ARMORS.helmet.find(a => a.id === sp.helmId) || p.helmet;
        }
        if (sp.chestId && (!p.chest || p.chest.id !== sp.chestId)) {
          p.chest = ARMORS.chest.find(a => a.id === sp.chestId) || p.chest;
        }
        if (sp.bootsId && (!p.boots || p.boots.id !== sp.bootsId)) {
          p.boots = ARMORS.boots.find(a => a.id === sp.bootsId) || p.boots;
        }
        p.x = sp.x;
        p.y = sp.y;
        p.vx = sp.vx;
        p.vy = sp.vy;
        p.hp = sp.hp;
        p.maxHp = sp.maxHp || 1000;
        p.energy = sp.energy !== undefined ? sp.energy : p.energy;
        p.maxEnergy = sp.maxEnergy || 100;
        p.facingRight = sp.facing;
        p.isCrouching = sp.crouch;
        p.isCharging = sp.charging;
        p.chargePower = sp.chargePower;
        p.statusEffects = sp.status;
        p.defeatState = sp.defeatState;
        p.deathOpacity = sp.deathOpacity;
        p.collapseAngle = sp.collapseAngle;
        p.shotsFired = sp.shotsFired;
        p.hitsLanded = sp.hitsLanded;
        p.totalDamageDealt = sp.totalDamageDealt;
        p.isDead = sp.isDead;

        if (sp.id === this.network.myPlayerId) {
          p.aimAngle = this.network.localAimAngle;
          p.facingRight = this.network.localFacingRight;
        } else {
          p.aimAngle = sp.aimAngle;
        }
      });
      if (needsHudRerender) {
        this.renderCombatHUD();
      }
    }

    if (msg.arrows) {
      this.arrows = msg.arrows.map(a => {
        const dummyWeapon = WEAPONS.find(w => w.element === a.element && w.tier === a.tier) || WEAPONS[0];
        const arrow = new Arrow(a.owner, a.x, a.y, a.angle, 300, dummyWeapon);
        arrow.vx = a.vx;
        arrow.vy = a.vy;
        arrow.isBoomerang = a.isBoomerang;
        arrow.isReturning = a.isReturning;
        return arrow;
      });
    }

    if (msg.aoe) {
      this.aoeZones = msg.aoe.map(z => {
        const zone = new AoEZone(z.x, z.y, z.element, z.owner);
        zone.radius = z.radius;
        zone.life = z.life;
        zone.maxLife = z.maxLife;
        return zone;
      });
    }

    if (msg.medikits) {
      this.medikits = msg.medikits.map(m => {
        const box = new Medikit(m.x, m.y);
        box.active = m.active;
        return box;
      });
    }

    if (msg.energyPacks) {
      this.energyPacks = msg.energyPacks.map(e => {
        const pack = new EnergyPack(e.x, e.y);
        pack.active = e.active;
        return pack;
      });
    }

    if (msg.blindBags) {
      this.blindBags = msg.blindBags.map(b => {
        const bag = new BlindBag(b.x, b.y);
        bag.active = b.active;
        return bag;
      });
    }

    this.updateCombatHUD();
  }

  applyMatchGameOver(msg) {
    this.state = 'GAMEOVER';
    sounds.playVictory();
    this.showLeaderboardModal(msg.leaderboard);
  }

  updateCombatHUD() {
    this.players.forEach(p => {
      let card = document.getElementById(`ffa-hud-${p.id}`);
      if (!card) {
        this.renderCombatHUD();
        card = document.getElementById(`ffa-hud-${p.id}`);
        if (!card) return;
      }

      if (p.isDead || p.defeatState !== 'ALIVE') {
        card.classList.add('eliminated');
      } else {
        card.classList.remove('eliminated');
      }

      const fillHp = document.getElementById(`${p.id}-hp-fill`);
      const textHp = document.getElementById(`${p.id}-hp-text`);
      if (fillHp && textHp) {
        const hpRatio = Math.max(0, p.hp / p.maxHp);
        fillHp.style.width = `${hpRatio * 100}%`;
        textHp.innerText = `${Math.ceil(p.hp)} / ${p.maxHp}`;
        let hpColor = '#2ed573';
        if (hpRatio < 0.3) hpColor = '#ff4757';
        else if (hpRatio < 0.6) hpColor = '#ffa502';
        fillHp.style.background = hpColor;
      }

      const fillEn = document.getElementById(`${p.id}-energy-fill`);
      const textEn = document.getElementById(`${p.id}-energy-text`);
      if (fillEn && textEn) {
        const enPercent = Math.max(0, (p.energy / p.maxEnergy) * 100);
        fillEn.style.width = `${enPercent}%`;
        textEn.innerText = `${Math.ceil(p.energy)} / ${p.maxEnergy} ⚡`;
      }

      const aimEl = document.getElementById(`${p.id}-stat-aim`);
      if (aimEl) {
        const deg = Math.round((( -p.aimAngle ) * 180 / Math.PI + 360) % 360);
        const powerText = p.isCharging ? ` | ⚡${Math.round(p.chargePower)}%` : '';
        aimEl.innerText = `🎯 ${deg}°${powerText}`;
      }

      const defEl = document.getElementById(`${p.id}-stat-def`);
      if (defEl) {
        const h = p.helmet ? p.helmet.defPercent : 0;
        const c = p.chest ? p.chest.defPercent : 0;
        const b = p.boots ? p.boots.defPercent : 0;
        defEl.innerText = `🛡️ Đ-${h}% T-${c}% C-${b}%`;
      }

      const weaponBadge = card.querySelector('.hud-weapon-badge');
      if (weaponBadge && p.weapon) {
        weaponBadge.innerText = `${p.weapon.name} (${p.weapon.tier})`;
      }

      this.renderStatusTags(`${p.id}-status-tags`, p.statusEffects);
    });
  }

  renderStatusTags(containerId, effects) {
    const el = document.getElementById(containerId);
    if (!el || !effects) return;
    let html = '';
    if (effects.burn > 0) html += `<span class="status-tag status-burn">🔥 (${effects.burn.toFixed(1)}s)</span>`;
    if (effects.freeze > 0) html += `<span class="status-tag status-freeze">❄️ (${effects.freeze.toFixed(1)}s)</span>`;
    if (effects.stun > 0) html += `<span class="status-tag status-stun">⚡ (${effects.stun.toFixed(1)}s)</span>`;
    if (effects.poison > 0) html += `<span class="status-tag status-poison">☠️ (${effects.poison.toFixed(1)}s)</span>`;
    if (effects.slow > 0) html += `<span class="status-tag status-slow">💧 (${effects.slow.toFixed(1)}s)</span>`;
    if (effects.levitate > 0) html += `<span class="status-tag status-wind">🌪️ (${effects.levitate.toFixed(1)}s)</span>`;
    el.innerHTML = html;
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    if (this.screenShakeTime > 0 && this.screenShakeDuration > 0) {
      const shakeFactor = this.screenShakeTime / this.screenShakeDuration;
      const mag = this.screenShakeIntensity * shakeFactor;
      const ox = (Math.random() - 0.5) * 2 * mag;
      const oy = (Math.random() - 0.5) * 2 * mag;
      ctx.translate(ox, oy);
    }

    const cfg = MAP_CONFIGS[this.currentMapId] || MAP_CONFIGS.jungle;
    this.drawSkyAndEnvironment(ctx, cfg);
    this.platforms.forEach(plat => this.drawPlatform(ctx, plat));

    if (this.state === 'PLAYING' || this.state === 'GAMEOVER') {
      this.aoeZones.forEach(z => z.draw(ctx));
      this.medikits.forEach(box => box.draw(ctx));
      this.energyPacks.forEach(pack => pack.draw(ctx));
      this.blindBags.forEach(bag => bag.draw(ctx));

      // Vẽ tất cả người chơi trong trận hỗn chiến
      this.players.forEach(p => p.draw(ctx));

      this.arrows.forEach(arrow => arrow.draw(ctx));
      this.particles.forEach(p => p.draw(ctx));
      this.lightnings.forEach(l => l.draw(ctx));
      this.floatingTexts.forEach(t => t.draw(ctx));

      // Vẽ đường định hướng ngắm cho tất cả người chơi còn sống
      this.players.forEach(p => {
        if (!p.isDead) this.drawAimGuide(ctx, p);
      });
    }

    ctx.restore();
  }

  drawAimGuide(ctx, char) {
    if (!char || char.isDead) return;
    const currentH = char.isCrouching ? char.height * 0.65 : char.height;
    const startX = char.x + Math.cos(char.aimAngle) * 35;
    const startY = (char.y - currentH * 0.6) + Math.sin(char.aimAngle) * 35;

    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = char.color || '#2ed573';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + Math.cos(char.aimAngle) * 95, startY + Math.sin(char.aimAngle) * 95);
    ctx.stroke();

    const endX = startX + Math.cos(char.aimAngle) * 95;
    const endY = startY + Math.sin(char.aimAngle) * 95;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(endX, endY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawSkyAndEnvironment(ctx, cfg) {
    const grad = ctx.createLinearGradient(0, 0, 0, 600);
    grad.addColorStop(0, cfg.skyColors[0]);
    grad.addColorStop(0.5, cfg.skyColors[1]);
    grad.addColorStop(1, cfg.skyColors[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    ctx.fillStyle = this.currentMapId === 'volcano' ? 'rgba(87, 96, 111, 0.45)' : 'rgba(255, 255, 255, 0.6)';
    this.drawCloud(ctx, 220, 120, 55);
    this.drawCloud(ctx, 680, 80, 70);
    this.drawCloud(ctx, 1050, 150, 50);

    ctx.fillStyle = cfg.mountainColor1;
    ctx.beginPath();
    ctx.moveTo(0, 620); ctx.lineTo(260, 420); ctx.lineTo(580, 620);
    ctx.fill();

    ctx.fillStyle = cfg.mountainColor2;
    ctx.beginPath();
    ctx.moveTo(480, 620); ctx.lineTo(820, 390); ctx.lineTo(1180, 620);
    ctx.fill();

    // VẼ SÀN ĐẤT VÀ CÁC HỐ TỬ THẦN (PITS)
    const pits = cfg.pits || [];

    // Nếu không có hố: vẽ sàn liền
    if (pits.length === 0) {
      ctx.fillStyle = cfg.groundColor;
      ctx.fillRect(0, this.groundY, 1280, 100);
      ctx.fillStyle = cfg.groundTopColor;
      ctx.fillRect(0, this.groundY, 1280, 14);
      ctx.fillStyle = cfg.flowerColor;
      for (let i = 80; i < 1240; i += 180) {
        ctx.beginPath();
        ctx.arc(i, this.groundY + 4, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Tính toán các đoạn thềm đất nằm ngoài hố
      const solidSegments = [];
      let currentLeft = 0;
      const sortedPits = [...pits].sort((a, b) => a.x - b.x);

      sortedPits.forEach(pit => {
        if (pit.x > currentLeft) {
          solidSegments.push({ x: currentLeft, width: pit.x - currentLeft });
        }
        currentLeft = Math.max(currentLeft, pit.x + pit.width);
      });
      if (currentLeft < 1280) {
        solidSegments.push({ x: currentLeft, width: 1280 - currentLeft });
      }

      // 1. Vẽ các thềm đất liền vững chắc
      solidSegments.forEach(seg => {
        ctx.fillStyle = cfg.groundColor;
        ctx.fillRect(seg.x, this.groundY, seg.width, 100);
        ctx.fillStyle = cfg.groundTopColor;
        ctx.fillRect(seg.x, this.groundY, seg.width, 14);

        ctx.fillStyle = cfg.flowerColor;
        for (let i = seg.x + 25; i < seg.x + seg.width - 20; i += 80) {
          ctx.beginPath();
          ctx.arc(i, this.groundY + 4, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 2. Vẽ hiệu ứng cảnh báo và đáy vực trong các hố
      sortedPits.forEach(pit => {
        if (pit.type === 'lava') {
          // Vực dung nham sôi sùng sục (Volcano)
          const lavaGrad = ctx.createLinearGradient(0, this.groundY, 0, 720);
          lavaGrad.addColorStop(0, '#c0392b');
          lavaGrad.addColorStop(0.3, '#e74c3c');
          lavaGrad.addColorStop(0.7, '#f39c12');
          lavaGrad.addColorStop(1, '#d35400');
          ctx.fillStyle = lavaGrad;
          ctx.fillRect(pit.x, this.groundY + 28, pit.width, 80);

          // Sóng dung nham nhấp nhô
          ctx.fillStyle = '#f1c40f';
          const time = Date.now() / 300;
          for (let bx = pit.x + 20; bx < pit.x + pit.width - 20; bx += 40) {
            const by = this.groundY + 30 + Math.sin(time + bx * 0.05) * 5;
            ctx.beginPath();
            ctx.arc(bx, by, 6, 0, Math.PI * 2);
            ctx.fill();
          }

          // Biển cảnh báo dung nham
          ctx.fillStyle = 'rgba(231, 76, 60, 0.4)';
          ctx.fillRect(pit.x, this.groundY, pit.width, 28);
        } else if (pit.type === 'crevasse') {
          // Khe nứt băng không đáy (Icecave)
          const iceGrad = ctx.createLinearGradient(0, this.groundY, 0, 720);
          iceGrad.addColorStop(0, 'rgba(12, 36, 97, 0.9)');
          iceGrad.addColorStop(1, '#050c1e');
          ctx.fillStyle = iceGrad;
          ctx.fillRect(pit.x, this.groundY + 14, pit.width, 90);

          // Nhũ băng nhọn chĩa xuống
          ctx.fillStyle = 'rgba(130, 204, 221, 0.6)';
          for (let ix = pit.x + 10; ix < pit.x + pit.width - 10; ix += 35) {
            ctx.beginPath();
            ctx.moveTo(ix, this.groundY + 14);
            ctx.lineTo(ix + 12, this.groundY + 14);
            ctx.lineTo(ix + 6, this.groundY + 38);
            ctx.fill();
          }
        } else {
          // Vực thẳm sâu tối tăm (Jungle)
          const chasmGrad = ctx.createLinearGradient(0, this.groundY, 0, 720);
          chasmGrad.addColorStop(0, '#0a0e17');
          chasmGrad.addColorStop(1, '#020408');
          ctx.fillStyle = chasmGrad;
          ctx.fillRect(pit.x, this.groundY + 14, pit.width, 90);

          // Sương mù ma quái dưới vực
          ctx.fillStyle = 'rgba(46, 213, 115, 0.15)';
          ctx.fillRect(pit.x, this.groundY + 35, pit.width, 50);
        }
      });
    }
  }

  drawCloud(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r * 0.7, y - r * 0.2, r * 0.75, 0, Math.PI * 2);
    ctx.arc(x - r * 0.7, y - r * 0.1, r * 0.65, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPlatform(ctx, plat) {
    ctx.save();
    if (plat.type === 'platform') {
      let topColor = '#2ed573';
      let bodyColor = '#57606f';

      if (this.currentMapId === 'volcano') {
        topColor = '#e74c3c';
        bodyColor = '#2f3542';
      } else if (this.currentMapId === 'icecave') {
        topColor = '#c7ecee';
        bodyColor = '#48dbfb';
      }

      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.roundRect(plat.x, plat.y, plat.width, plat.height, [6, 6, 8, 8]);
      ctx.fill();

      ctx.fillStyle = topColor;
      ctx.fillRect(plat.x, plat.y, plat.width, 6);

      ctx.strokeStyle = '#1e272e';
      ctx.lineWidth = 2;
      ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
    }
    ctx.restore();
  }

  setupLobbyUI() {
    const weaponSelect = document.getElementById('my-weapon-select');
    if (weaponSelect) {
      weaponSelect.innerHTML = '';
      WEAPONS.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w.id;
        opt.innerText = `[${w.tier}] ${w.name}`;
        weaponSelect.appendChild(opt);
      });
      weaponSelect.value = 'bow_sss_split';
    }

    this.populateArmorSelect('my-helmet-select', ARMORS.helmet, 'helm_sss');
    this.populateArmorSelect('my-chest-select', ARMORS.chest, 'chest_ss');
    this.populateArmorSelect('my-boots-select', ARMORS.boots, 'boots_s');

    document.querySelectorAll('.map-card').forEach(card => {
      card.addEventListener('click', () => {
        if (!this.network.isHost && this.network.inRoom) {
          alert('Chỉ Chủ phòng (Host) mới có quyền đổi bản đồ thi đấu!');
          return;
        }
        document.querySelectorAll('.map-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const mapId = card.getAttribute('data-map');
        this.applyMapConfig(mapId);
        this.network.onHostMapSelect(mapId);
      });
    });

    const updateAll = () => {
      this.updateWeaponDescriptions();
      this.renderPreview();
      this.network.onMyProfileChanged();
    };

    ['my-weapon-select', 'my-helmet-select', 'my-chest-select', 'my-boots-select'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', updateAll);
    });

    updateAll();

    // Nút Bắt Đầu Trận Đấu
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (!this.network.isHost) {
          alert('Chỉ Chủ phòng (Host) mới có quyền bấm Bắt đầu trận đấu!');
          return;
        }
        sounds.init();
        this.startMatchAsHost();
      });
    }

    // Nút Tái Đấu
    const rematchBtn = document.getElementById('btn-rematch');
    if (rematchBtn) {
      rematchBtn.addEventListener('click', () => {
        if (this.network.isHost) {
          sounds.init();
          this.startMatchAsHost();
          this.network.broadcastToClients({ type: 'MATCH_REMATCH', mapId: this.currentMapId, players: this.network.getRoomPlayersList() });
        } else {
          alert('Vui lòng chờ Chủ phòng (Host) bấm Tái Đấu!');
        }
      });
    }

    // Nút Về Sảnh
    const handleReturn = () => {
      if (this.network.isHost) {
        this.network.broadcastToClients({ type: 'MATCH_RETURN_LOBBY' });
      }
      this.goToLobby();
    };

    const returnBtn = document.getElementById('btn-return-lobby');
    const backBtn = document.getElementById('btn-back-lobby');
    if (returnBtn) returnBtn.addEventListener('click', handleReturn);
    if (backBtn) backBtn.addEventListener('click', handleReturn);

    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        sounds.enabled = !sounds.enabled;
        soundBtn.innerText = sounds.enabled ? '🔊' : '🔇';
      });
    }
  }

  populateArmorSelect(selectId, armors, defaultValue) {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    sel.innerHTML = '';
    armors.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.innerText = `${a.name} (-${a.defPercent}%)`;
      sel.appendChild(opt);
    });
    sel.value = defaultValue;
  }

  updateWeaponDescriptions() {
    const wEl = document.getElementById('my-weapon-select');
    const descEl = document.getElementById('my-weapon-desc');
    if (wEl && descEl) {
      const w = WEAPONS.find(item => item.id === wEl.value);
      if (w) {
        descEl.innerHTML = `
          <strong>Sát thương:</strong> ${w.baseDamage} | <strong>Tốc độ tên:</strong> x${w.speedMultiplier}<br>
          <strong>Kỹ năng:</strong> ${w.desc}
        `;
      }
    }

    const hEl = document.getElementById('my-helmet-select');
    const cEl = document.getElementById('my-chest-select');
    const bEl = document.getElementById('my-boots-select');
    if (hEl) {
      const h = ARMORS.helmet.find(a => a.id === hEl.value);
      if (h) document.getElementById('stat-head').innerText = `-${h.defPercent}%`;
    }
    if (cEl) {
      const c = ARMORS.chest.find(a => a.id === cEl.value);
      if (c) document.getElementById('stat-body').innerText = `-${c.defPercent}%`;
    }
    if (bEl) {
      const b = ARMORS.boots.find(a => a.id === bEl.value);
      if (b) document.getElementById('stat-limbs').innerText = `-${b.defPercent}%`;
    }
  }

  renderPreview() {
    const canvas = document.getElementById('previewPlayer');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height - 28);
    ctx.scale(1.4, 1.4);

    const dummy = new Character('p1', 'Preview', 0, 0, true, '#2ed573');
    dummy.weapon = WEAPONS.find(w => w.id === document.getElementById('my-weapon-select').value) || WEAPONS[0];
    dummy.helmet = ARMORS.helmet.find(a => a.id === document.getElementById('my-helmet-select').value) || ARMORS.helmet[0];
    dummy.chest = ARMORS.chest.find(a => a.id === document.getElementById('my-chest-select').value) || ARMORS.chest[0];
    dummy.boots = ARMORS.boots.find(a => a.id === document.getElementById('my-boots-select').value) || ARMORS.boots[0];

    dummy.aimAngle = -0.38;
    dummy.draw(ctx);
    ctx.restore();
  }

  goToLobby() {
    this.state = 'LOBBY';
    document.getElementById('combat-hud').classList.remove('active');
    document.getElementById('combat-hud').classList.add('hidden');
    document.getElementById('gameover-modal').classList.remove('active');
    document.getElementById('gameover-modal').classList.add('hidden');

    document.getElementById('lobby-screen').classList.remove('hidden');
    document.getElementById('lobby-screen').classList.add('active');

    this.renderPreview();
    this.network.updateLobbyRoomUI();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameManager();
  game.init();
});
