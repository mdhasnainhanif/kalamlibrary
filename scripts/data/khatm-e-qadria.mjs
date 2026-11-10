/**
 * Khatm-e-Qadria (Qadri Aurad o Wazaif) — full text, transcribed from the
 * "Khatme Qadriah" PDF (56 pages + cover/instructions).
 *
 * Layout notes (see utils/parseKalamCouplets.ts):
 *  - Lyrics are split into 2-line "stanza" tiles. Every section below is emitted as ONE
 *    block (lines joined with "\n"); sections are separated by a blank line.
 *  - The first tile of every section is [title, repeat-instruction].
 *  - Arabic text lives in the `urdu` slot (same convention as the Qasida Burda import).
 */

export const SLUG = "khatm-e-qadria";
export const TITLE_ROMAN = "Khatm-e-Qadria";
export const TITLE_URDU = "ختم قادریہ";
// Compiled Qadri litany (Quran, Durood, Qasida Ghausia, wazaif). No single poet is credited so that
// Quranic text is not mis-attributed; the site hides placeholder authors in the UI.
export const AUTHOR_NAME = "Unknown";

const UR = {
  x111: "(۱۱۱ مرتبہ پڑھیں)",
  x11: "(۱۱ مرتبہ پڑھیں)",
  once: "(ایک مرتبہ پڑھیں)",
};
const RO = {
  x111: "(Recite 111 times)",
  x11: "(Recite 11 times)",
  once: "(Recite once)",
};

/** @type {Array<{ur:string, ro:string, rep:'x111'|'x11'|'once'|null, items:Array<{ar:string[], rom:string[], en?:string[]}>, raw?:{ur:string[], ro:string[]}}>} */
export const SECTIONS = [
  // ---------------------------------------------------------------- intro
  {
    ur: "ختم قادریہ",
    ro: "Khatm-e-Qadria",
    rep: null,
    raw: {
      ur: [
        "ختم قادریہ",
        "اَورَاد و وَظَائِف — سلسلۂ قادریہ",
        "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ",
        "پڑھنے کا طریقہ",
        "کوئی خاص حاجت ہو یا مشکل پیش آئے، یا شیطانی اثرات اور جادو کا اندیشہ ہو",
        "تو گیارہ افراد جمع ہو کر ختمِ قادریہ پڑھیں",
        "میٹھی چیز تیار کر کے فاتحہ دلائی جائے",
        "ثواب سیدنا غوثِ اعظم رضی اللہ عنہ کی نذر کر کے اللہ تعالیٰ سے دعا کی جائے",
        "ان شاء اللہ حاجت پوری ہوگی اور مشکلات دور ہوں گی",
        "عام دنوں میں بھی پڑھنا بڑی برکت کا ذریعہ ہے",
      ],
      ro: [
        "Khatm-e-Qadria",
        "Aurad o Wazaif of the Qadri Silsila",
        "Bismillahir Rahmanir Raheem",
        "Method of recitation",
        "If you have a specific need, or a difficulty arises, or you are affected by evil spirits or black magic,",
        "then eleven people should gather and recite Khatm-e-Qadria.",
        "A sweet dish should be prepared and Fatiha should be offered.",
        "The reward should be presented, and dua made to Allah Ta'ala through the wasila of Sayyiduna Ghauth al-Azam (may Allah be pleased with him).",
        "Allah willing, the need will be fulfilled and the difficulties will be alleviated.",
        "Reciting it even on normal days (without any specific need) is a means of great blessings.",
      ],
    },
    items: [],
  },

  // ---------------------------------------------------------------- page 1
  {
    ur: "درود شریف",
    ro: "Durood Sharif",
    rep: "x111",
    items: [
      {
        ar: [
          "اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ",
          "مَعْدِنِ الْجُودِ وَالْكَرَمِ وَآلِهِ وَبَارِكْ وَسَلِّمْ",
        ],
        rom: [
          "Allahumma salli 'alaa Sayyidinaa wa Mawlaanaa Muhammadim",
          "Ma'danil-joodi wal-karami wa aalihi wa baarik wa sallim.",
        ],
        en: [
          "O Allah, send salutations, greetings and blessings upon our master and patron Muhammad (peace be upon him),",
          "the source of all goodness and generosity, and upon his family.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- page 2
  {
    ur: "تیسرا کلمہ (تمجید)",
    ro: "Third Kalimah (Tamjeed)",
    rep: "x111",
    items: [
      {
        ar: [
          "سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ",
          "وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيمِ",
        ],
        rom: [
          "Subhaanallaahi wal-hamdu lillaahi wa laa ilaaha illallaahu wallaahu akbar.",
          "Wa laa hawla wa laa quwwata illaa billaahil-'Aliyyil-'Azeem.",
        ],
        en: [
          "Glorified is Allah and all praise is for Allah. There is no god but Allah, and Allah is the Greatest.",
          "There is no might or strength except through Allah, the Most High, the Most Great.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- page 3
  {
    ur: "سورۃ الم نشرح",
    ro: "Surah Alam Nashrah (Surah 94)",
    rep: "x111",
    items: [
      {
        ar: [
          "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ",
          "الَّذِي أَنقَضَ ظَهْرَكَ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَ",
          "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
          "فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَبْ",
        ],
        rom: [
          "Alam nashrah laka sadrak. Wa wada'naa 'anka wizrak.",
          "Alladhee anqada zahrak. Wa rafa'naa laka dhikrak.",
          "Fa-inna ma'al-'usri yusraa. Inna ma'al-'usri yusraa.",
          "Fa-idhaa faraghta fansab. Wa ilaa Rabbika farghab.",
        ],
        en: [
          "Have We not expanded your chest? And removed from you your burden,",
          "which had broken your back? And We have exalted for you your remembrance.",
          "Therefore, surely there is ease with hardship. Undoubtedly, there is ease with hardship.",
          "So when you are free (from prayer), strive hard in worship, and turn to your Lord alone.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- page 4
  {
    ur: "سورۃ الاخلاص",
    ro: "Surah Ikhlas (Surah 112)",
    rep: "x111",
    items: [
      {
        ar: [
          "قُلْ هُوَ اللَّهُ أَحَدٌ",
          "اللَّهُ الصَّمَدُ",
          "لَمْ يَلِدْ وَلَمْ يُولَدْ",
          "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        ],
        rom: [
          "Qul huwallaahu ahad.",
          "Allaahus-samad.",
          "Lam yalid wa lam yoolad.",
          "Wa lam yakul-lahu kufuwan ahad.",
        ],
        en: [
          "Say: He is Allah, the One. Allah, the Independent, free of all needs.",
          "He does not give birth, nor was He born; and there is none equal to Him.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- pages 5-7
  {
    ur: "یا باقی",
    ro: "Ya Baaqi",
    rep: "x111",
    items: [
      {
        ar: ["يَا بَاقِي أَنْتَ الْبَاقِي"],
        rom: ["Yaa Baaqi, antal Baaqi"],
        en: ["O Everlasting One, You are the Everlasting!"],
      },
    ],
  },
  {
    ur: "یا شافی",
    ro: "Ya Shaafi",
    rep: "x111",
    items: [
      {
        ar: ["يَا شَافِي أَنْتَ الشَّافِي"],
        rom: ["Yaa Shaafi, antash-Shaafi"],
        en: ["O Healer, You are the Healer!"],
      },
    ],
  },
  {
    ur: "یا کافی",
    ro: "Ya Kaafi",
    rep: "x111",
    items: [
      {
        ar: ["يَا كَافِي أَنْتَ الْكَافِي"],
        rom: ["Yaa Kaafi, antal Kaafi"],
        en: ["O Sufficient One, You are the All-Sufficient!"],
      },
    ],
  },

  // ---------------------------------------------------------------- pages 8-11
  {
    ur: "یا رسول اللہ انظر حالنا",
    ro: "Ya Rasoolallah Unzur Haalanaa",
    rep: "x11",
    items: [
      {
        ar: [
          "يَا رَسُولَ اللّٰهِ انْظُرْ حَالَنَا",
          "يَا حَبِيبَ اللّٰهِ اسْمَعْ قَالَنَا",
          "إِنَّنِي فِي بَحْرِ هَمٍّ مُغْرَقُ",
          "خُذْ يَدِي سَهِّلْ لَنَا إِشْكَالَنَا",
        ],
        rom: [
          "Yaa Rasoolallaahi unzur haalanaa",
          "Yaa Habeebal-laahi isma' qaalanaa",
          "Innanee fee bahri hammim mughraqun",
          "Khudh yadee sahhil lanaa ishkaalanaa",
        ],
        en: [
          "O Messenger of Allah, look upon our state; O Beloved of Allah, listen to our plea.",
          "I am drowning in an ocean of grief — take my hand and ease our difficulties.",
        ],
      },
    ],
  },
  {
    ur: "یا حبیب الٰہی خذ بیدی",
    ro: "Ya Habeebal-Ilaah Khudh Biyadee",
    rep: "x11",
    items: [
      {
        ar: [
          "يَا حَبِيبَ الْإِلٰهِ خُذْ بِيَدِي",
          "مَا لِعَجْزِي سِوَاكَ مُسْتَنَدِي",
        ],
        rom: [
          "Yaa Habeebal-Ilaahi khudh bi-yadee",
          "Maa li 'ajzee siwaaka mustanadee",
        ],
        en: [
          "O Beloved of the Lord, take me by the hand.",
          "In my helplessness I have no support other than you.",
        ],
      },
    ],
  },
  {
    ur: "فسهل یا الٰہی کل صعب",
    ro: "Fa-sahhil Yaa Ilaahee",
    rep: "x11",
    items: [
      {
        ar: [
          "فَسَهِّلْ يَا إِلٰهِي كُلَّ صَعْبٍ",
          "بِحُرْمَةِ سَيِّدِ الْأَبْرَارِ سَهِّلْ",
        ],
        rom: [
          "Fasahhil yaa Ilaahee kulla sa'bin",
          "Bihurmati Sayyidil-Abraari sahhil",
        ],
        en: [
          "O my God, make every difficulty easy for us;",
          "for the sake of the honour of the Master of the righteous (peace be upon him), make it easy.",
        ],
      },
    ],
  },
  {
    ur: "یا صدیق یا عمر",
    ro: "Ya Siddiq Ya Umar",
    rep: "x11",
    items: [
      {
        ar: [
          "يَا صِدِّيقُ يَا عُمَرُ يَا عُثْمَانُ يَا حَيْدَرُ",
          "دَفْعَ شَرٍّ كُنْ خَيْرَ آوَرْ يَا شَبِّيرُ يَا شَبَّرُ",
        ],
        rom: [
          "Yaa Siddeeq, yaa Umar, yaa Uthmaan, yaa Haidar",
          "Daf'a sharri kun khayra aawar, yaa Shabbeer, yaa Shabbar",
        ],
        en: [
          "O Siddiq, O Umar, O Uthman, O Haydar (Ali) — may Allah be pleased with them —",
          "and O Imam Hasan, O Imam Husain: please repel all evil and bless us with safety.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- pages 12-19
  {
    ur: "یا حضرت سلطان شیخ سید شاہ عبد القادر جیلانی",
    ro: "Ya Hadrat Sultan Shaykh Sayyid Shah Abdul Qadir Jilani",
    rep: "x111",
    items: [
      {
        ar: [
          "يَا حَضْرَتَ سُلْطَانَ شَيْخَ سَيِّدَ شَاهْ",
          "عَبْدَ الْقَادِرْ جِيلَانِي شَيْئًا لِلّٰهِ الْمَدَدْ",
        ],
        rom: [
          "Yaa Hadrat Sultan Shaykh Sayyid Shah",
          "Abdul Qadir Jilani, shay'an lillaah, al-madad",
        ],
        en: [
          "O Hazrat, Sultan of the Saints, Shaykh Sayyid Shah Abdul Qadir Jilani,",
          "for the sake of Allah, grant us your help!",
        ],
      },
    ],
  },
  {
    ur: "ما همه محتاج تو حاجت روا",
    ro: "Maa Hama Muhtaaj, Tu Haajat Rawaa",
    rep: "x111",
    items: [
      {
        ar: [
          "مَا هَمَهْ مُحْتَاجِ تُو حَاجَتْ رَوَا",
          "الْمَدَدْ يَا غَوْثِ أَعْظَمْ سَيِّدَا",
        ],
        rom: [
          "Maa hamah muhtaaj, tu haajat rawaa",
          "Al-madad yaa Ghauth-e-A'zam Sayyidaa",
        ],
        en: [
          "We are all needy, and you are the fulfiller of needs;",
          "help us, O Ghauth-e-A'zam, our master!",
        ],
      },
    ],
  },
  {
    ur: "مشکلات بے عدد داریم ما",
    ro: "Mushkilaat-e-Be-Adad Daareem Maa",
    rep: "x111",
    items: [
      {
        ar: [
          "مُشْكِلَاتِ بِي عَدَدْ دَارِيمْ مَا",
          "الْمَدَدْ يَا غَوْثِ أَعْظَمْ پِيرِ مَا",
        ],
        rom: [
          "Mushkilaat-e-be-adad daareem maa",
          "Al-madad yaa Ghauth-e-A'zam peer-e-maa",
        ],
        en: [
          "We are engulfed in countless difficulties.",
          "Help us, O Ghauth-e-A'zam, our spiritual guide!",
        ],
      },
    ],
  },
  {
    ur: "یا حضرت شیخ محی الدین",
    ro: "Ya Hadrat Shaykh Muhyiddin",
    rep: "x111",
    items: [
      {
        ar: [
          "يَا حَضْرَتَ شَيْخَ مُحْيِي الدِّينْ",
          "مُشْكِلْ كُشَا بِالْخَيْرْ",
        ],
        rom: [
          "Yaa Hadrat Shaykh Muhyiddeen",
          "Mushkil-kushaa bil-khayr",
        ],
        en: [
          "O honourable Shaykh Muhyiddin (Abdul Qadir Jilani),",
          "reliever of difficulties — grant us goodness and safety!",
        ],
      },
    ],
  },
  {
    ur: "امداد کن امداد کن",
    ro: "Imdaad Kun, Imdaad Kun",
    rep: "x111",
    items: [
      {
        ar: [
          "امْدَادْ كُنْ امْدَادْ كُنْ اَزْ بَنْدِ غَمْ آزَادْ كُنْ",
          "دَرْ دِينْ وَ دُنْيَا شَادْ كُنْ يَا غَوْثِ أَعْظَمْ دَسْتَگِيرْ",
        ],
        rom: [
          "Imdaad kun, imdaad kun, az band-e-gham aazaad kun",
          "Dar deen-o-dunyaa shaad kun, yaa Ghauth-e-A'zam dastageer",
        ],
        en: [
          "Help us, help us, free us from the bonds of grief;",
          "make us happy in religion and in this world, O Ghauth-e-A'zam, our helper!",
        ],
      },
    ],
  },
  {
    ur: "یا حضرت غوث اغثنا بإذن اللہ تعالیٰ",
    ro: "Ya Hadrat Ghauth, Aghithnaa",
    rep: "x111",
    items: [
      {
        ar: ["يَا حَضْرَتَ غَوْثْ، أَغِثْنَا بِإِذْنِ اللّٰهِ تَعَالَى"],
        rom: ["Yaa Hadrat Ghauth, aghithnaa bi-idhnillaahi Ta'aalaa"],
        en: ["O Hazrat Ghauth, help us by the permission of Allah, the Exalted."],
      },
    ],
  },
  {
    ur: "خذ بیدی یا شاہ جیلاں",
    ro: "Khudh Yadee Ya Shah-e-Jilaan",
    rep: "x111",
    items: [
      {
        ar: [
          "خُذْ بِيَدِي يَا شَاهِ جِيلَانْ خُذْ بِيَدِي",
          "شَيْئًا لِلّٰهِ أَنْتَ نُورُ أَحْمَدِي",
        ],
        rom: [
          "Khudh yadee yaa Shaah-e-Jeelaan khudh yadee",
          "Shay'an lillaah, anta noorun Ahmadee",
        ],
        en: [
          "Take my hand, O Shah of Jilan, take my hand;",
          "for the sake of Allah — you are the light of Ahmad (peace be upon him).",
        ],
      },
    ],
  },
  {
    ur: "طفیل حضرت دستگیر",
    ro: "Tufayl-e-Hadrat-e-Dastageer",
    rep: "x111",
    items: [
      {
        ar: ["طُفَيْلِ حَضْرَتِ دَسْتَگِيرْ دُشْمَنْ هُوئے زِيرْ"],
        rom: ["Tufayl-e-Hadrat-e-Dastageer, dushman hu'ay zayr"],
        en: [
          "Through the blessing of Hazrat Dastageer (Ghauth-e-A'zam), may the enemy be overcome.",
          "(Tap your hand on the floor with the intention of striking your enemy; this helps safeguard you from the enemy.)",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- pages 20-24: Surah Yasin
  {
    ur: "سورۃ یٰس — پہلا رکوع",
    ro: "Surah Yaseen (36) — 1st Ruku",
    rep: "once",
    items: [
      {
        ar: [
          "يس",
          "وَالْقُرْآنِ الْحَكِيمِ",
          "إِنَّكَ لَمِنَ الْمُرْسَلِينَ",
          "عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
          "تَنزِيلَ الْعَزِيزِ الرَّحِيمِ",
          "لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ",
          "لَقَدْ حَقَّ الْقَوْلُ عَلَىٰ أَكْثَرِهِمْ فَهُمْ لَا يُؤْمِنُونَ",
          "إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُم مُّقْمَحُونَ",
          "وَجَعَلْنَا مِن بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ",
          "وَسَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
          "إِنَّمَا تُنذِرُ مَنِ اتَّبَعَ الذِّكْرَ وَخَشِيَ الرَّحْمَٰنَ بِالْغَيْبِ ۖ فَبَشِّرْهُ بِمَغْفِرَةٍ وَأَجْرٍ كَرِيمٍ",
          "إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ ۚ وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُّبِينٍ",
        ],
        rom: [
          "Yaa Seen.",
          "Wal-Qur'aanil-Hakeem.",
          "Innaka la-minal-mursaleen.",
          "'Alaa siraatim-mustaqeem.",
          "Tanzeelal-'Azeezir-Raheem.",
          "Litundhira qawmam-maa undhira aabaa'uhum fahum ghaafiloon.",
          "Laqad haqqal-qawlu 'alaa aktharihim fahum laa yu'minoon.",
          "Innaa ja'alnaa fee a'naaqihim aghlaalan fahiya ilal-adhqaani fahum muqmahoon.",
          "Wa ja'alnaa mim bayni aydeehim saddan wa min khalfihim saddan fa-aghshaynaahum fahum laa yubsiroon.",
          "Wa sawaa'un 'alayhim a-andhartahum am lam tundhirhum laa yu'minoon.",
          "Innamaa tundhiru manit-taba'adh-dhikra wa khashiyar-Rahmaana bil-ghayb; fabashshirhu bimaghfiratiw-wa ajrin kareem.",
          "Innaa nahnu nuhyil-mawtaa wa naktubu maa qaddamoo wa aathaarahum; wa kulla shay'in ahsaynaahu fee imaamim-mubeen.",
        ],
      },
    ],
  },
  {
    ur: "سورۃ یٰس — دوسرا رکوع",
    ro: "Surah Yaseen (36) — 2nd Ruku",
    rep: "once",
    items: [
      {
        ar: [
          "وَاضْرِبْ لَهُم مَّثَلًا أَصْحَابَ الْقَرْيَةِ إِذْ جَاءَهَا الْمُرْسَلُونَ",
          "إِذْ أَرْسَلْنَا إِلَيْهِمُ اثْنَيْنِ فَكَذَّبُوهُمَا فَعَزَّزْنَا بِثَالِثٍ فَقَالُوا إِنَّا إِلَيْكُم مُّرْسَلُونَ",
          "قَالُوا مَا أَنتُمْ إِلَّا بَشَرٌ مِّثْلُنَا وَمَا أَنزَلَ الرَّحْمَٰنُ مِن شَيْءٍ إِنْ أَنتُمْ إِلَّا تَكْذِبُونَ",
          "قَالُوا رَبُّنَا يَعْلَمُ إِنَّا إِلَيْكُمْ لَمُرْسَلُونَ",
          "وَمَا عَلَيْنَا إِلَّا الْبَلَاغُ الْمُبِينُ",
          "قَالُوا إِنَّا تَطَيَّرْنَا بِكُمْ ۖ لَئِن لَّمْ تَنتَهُوا لَنَرْجُمَنَّكُمْ وَلَيَمَسَّنَّكُم مِّنَّا عَذَابٌ أَلِيمٌ",
          "قَالُوا طَائِرُكُم مَّعَكُمْ ۚ أَئِن ذُكِّرْتُم ۚ بَلْ أَنتُمْ قَوْمٌ مُّسْرِفُونَ",
          "وَجَاءَ مِنْ أَقْصَى الْمَدِينَةِ رَجُلٌ يَسْعَىٰ قَالَ يَا قَوْمِ اتَّبِعُوا الْمُرْسَلِينَ",
          "اتَّبِعُوا مَن لَّا يَسْأَلُكُمْ أَجْرًا وَهُم مُّهْتَدُونَ",
          "وَمَا لِيَ لَا أَعْبُدُ الَّذِي فَطَرَنِي وَإِلَيْهِ تُرْجَعُونَ",
          "أَأَتَّخِذُ مِن دُونِهِ آلِهَةً إِن يُرِدْنِ الرَّحْمَٰنُ بِضُرٍّ لَّا تُغْنِ عَنِّي شَفَاعَتُهُمْ شَيْئًا وَلَا يُنقِذُونِ",
          "إِنِّي إِذًا لَّفِي ضَلَالٍ مُّبِينٍ",
          "إِنِّي آمَنتُ بِرَبِّكُمْ فَاسْمَعُونِ",
          "قِيلَ ادْخُلِ الْجَنَّةَ ۖ قَالَ يَا لَيْتَ قَوْمِي يَعْلَمُونَ",
          "بِمَا غَفَرَ لِي رَبِّي وَجَعَلَنِي مِنَ الْمُكْرَمِينَ",
          "وَمَا أَنزَلْنَا عَلَىٰ قَوْمِهِ مِن بَعْدِهِ مِن جُندٍ مِّنَ السَّمَاءِ وَمَا كُنَّا مُنزِلِينَ",
          "إِن كَانَتْ إِلَّا صَيْحَةً وَاحِدَةً فَإِذَا هُمْ خَامِدُونَ",
          "يَا حَسْرَةً عَلَى الْعِبَادِ ۚ مَا يَأْتِيهِم مِّن رَّسُولٍ إِلَّا كَانُوا بِهِ يَسْتَهْزِئُونَ",
          "أَلَمْ يَرَوْا كَمْ أَهْلَكْنَا قَبْلَهُم مِّنَ الْقُرُونِ أَنَّهُمْ إِلَيْهِمْ لَا يَرْجِعُونَ",
          "وَإِن كُلٌّ لَّمَّا جَمِيعٌ لَّدَيْنَا مُحْضَرُونَ",
        ],
        rom: [
          "Wadrib lahum mathalan as-haabal-qaryah, idh jaa'ahal-mursaloon.",
          "Idh arsalnaa ilayhimuth-nayni fakadhdhaboohumaa fa'azzaznaa bithaalithin faqaaloo innaa ilaykum mursaloon.",
          "Qaaloo maa antum illaa basharum-mithlunaa wa maa anzalar-Rahmaanu min shay'in in antum illaa takdhiboon.",
          "Qaaloo Rabbunaa ya'lamu innaa ilaykum lamursaloon.",
          "Wa maa 'alaynaa illal-balaaghul-mubeen.",
          "Qaaloo innaa tatayyarnaa bikum, la'il-lam tantahoo lanarjumannakum wa layamassannakum minnaa 'adhaabun aleem.",
          "Qaaloo taa'irukum ma'akum; a'in dhukkirtum; bal antum qawmum-musrifoon.",
          "Wa jaa'a min aqsal-madeenati rajuluy-yas'aa qaala yaa qawmit-tabi'ul-mursaleen.",
          "Ittabi'oo mal-laa yas'alukum ajranw-wa hum muhtadoon.",
          "Wa maa liya laa a'budul-ladhee fataranee wa ilayhi turja'oon.",
          "A-attakhidhu min doonihee aalihatan iy-yuridnir-Rahmaanu bidurril-laa tughni 'annee shafaa'atuhum shay'anw-wa laa yunqidhoon.",
          "Innee idhal-lafee dalaalim-mubeen.",
          "Innee aamantu bi-Rabbikum fasma'oon.",
          "Qeelad-khulil-jannah; qaala yaa layta qawmee ya'lamoon.",
          "Bimaa ghafara lee Rabbee wa ja'alanee minal-mukrameen.",
          "Wa maa anzalnaa 'alaa qawmihee mim ba'dihee min jundim-minas-samaa'i wa maa kunnaa munzileen.",
          "In kaanat illaa sayhatan waahidatan fa-idhaa hum khaamidoon.",
          "Yaa hasratan 'alal-'ibaad; maa ya'teehim mir-rasoolin illaa kaanoo bihee yastahzi'oon.",
          "Alam yaraw kam ahlaknaa qablahum minal-qurooni annahum ilayhim laa yarji'oon.",
          "Wa in kullul-lammaa jamee'ul-ladaynaa muhdaroon.",
        ],
      },
    ],
  },
  {
    ur: "سورۃ یٰس — تیسرا رکوع",
    ro: "Surah Yaseen (36) — 3rd Ruku",
    rep: "once",
    items: [
      {
        ar: [
          "وَآيَةٌ لَّهُمُ الْأَرْضُ الْمَيْتَةُ أَحْيَيْنَاهَا وَأَخْرَجْنَا مِنْهَا حَبًّا فَمِنْهُ يَأْكُلُونَ",
          "وَجَعَلْنَا فِيهَا جَنَّاتٍ مِّن نَّخِيلٍ وَأَعْنَابٍ وَفَجَّرْنَا فِيهَا مِنَ الْعُيُونِ",
          "لِيَأْكُلُوا مِن ثَمَرِهِ وَمَا عَمِلَتْهُ أَيْدِيهِمْ ۖ أَفَلَا يَشْكُرُونَ",
          "سُبْحَانَ الَّذِي خَلَقَ الْأَزْوَاجَ كُلَّهَا مِمَّا تُنبِتُ الْأَرْضُ وَمِنْ أَنفُسِهِمْ وَمِمَّا لَا يَعْلَمُونَ",
          "وَآيَةٌ لَّهُمُ اللَّيْلُ نَسْلَخُ مِنْهُ النَّهَارَ فَإِذَا هُم مُّظْلِمُونَ",
          "وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ",
          "وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ",
          "لَا الشَّمْسُ يَنبَغِي لَهَا أَن تُدْرِكَ الْقَمَرَ وَلَا اللَّيْلُ سَابِقُ النَّهَارِ ۚ وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ",
          "وَآيَةٌ لَّهُمْ أَنَّا حَمَلْنَا ذُرِّيَّتَهُمْ فِي الْفُلْكِ الْمَشْحُونِ",
          "وَخَلَقْنَا لَهُم مِّن مِّثْلِهِ مَا يَرْكَبُونَ",
          "وَإِن نَّشَأْ نُغْرِقْهُمْ فَلَا صَرِيخَ لَهُمْ وَلَا هُمْ يُنقَذُونَ",
          "إِلَّا رَحْمَةً مِّنَّا وَمَتَاعًا إِلَىٰ حِينٍ",
          "وَإِذَا قِيلَ لَهُمُ اتَّقُوا مَا بَيْنَ أَيْدِيكُمْ وَمَا خَلْفَكُمْ لَعَلَّكُمْ تُرْحَمُونَ",
          "وَمَا تَأْتِيهِم مِّنْ آيَةٍ مِّنْ آيَاتِ رَبِّهِمْ إِلَّا كَانُوا عَنْهَا مُعْرِضِينَ",
          "وَإِذَا قِيلَ لَهُمْ أَنفِقُوا مِمَّا رَزَقَكُمُ اللَّهُ قَالَ الَّذِينَ كَفَرُوا لِلَّذِينَ آمَنُوا أَنُطْعِمُ مَن لَّوْ يَشَاءُ اللَّهُ أَطْعَمَهُ إِنْ أَنتُمْ إِلَّا فِي ضَلَالٍ مُّبِينٍ",
          "وَيَقُولُونَ مَتَىٰ هَٰذَا الْوَعْدُ إِن كُنتُمْ صَادِقِينَ",
          "مَا يَنظُرُونَ إِلَّا صَيْحَةً وَاحِدَةً تَأْخُذُهُمْ وَهُمْ يَخِصِّمُونَ",
          "فَلَا يَسْتَطِيعُونَ تَوْصِيَةً وَلَا إِلَىٰ أَهْلِهِمْ يَرْجِعُونَ",
        ],
        rom: [
          "Wa aayatul-lahumul-ardul-maytatu ahyaynaahaa wa akhrajnaa minhaa habban faminhu ya'kuloon.",
          "Wa ja'alnaa feehaa jannaatim-min nakheeliw-wa a'naabiw-wa fajjarnaa feehaa minal-'uyoon.",
          "Liya'kuloo min thamarihee wa maa 'amilat-hu aydeehim; afalaa yashkuroon.",
          "Subhaanal-ladhee khalaqal-azwaaja kullahaa mimmaa tumbitul-ardu wa min anfusihim wa mimmaa laa ya'lamoon.",
          "Wa aayatul-lahumul-laylu naslakhu minhun-nahaara fa-idhaa hum muzlimoon.",
          "Wash-shamsu tajree limustaqarril-lahaa; dhaalika taqdeerul-'Azeezil-'Aleem.",
          "Wal-qamara qaddarnaahu manaazila hattaa 'aada kal-'urjoonil-qadeem.",
          "Laash-shamsu yambaghee lahaa an tudrikal-qamara wa lal-laylu saabiqun-nahaar; wa kullun fee falakiy-yasbahoon.",
          "Wa aayatul-lahum annaa hamalnaa dhurriyyatahum fil-fulkil-mashhoon.",
          "Wa khalaqnaa lahum mim mithlihee maa yarkaboon.",
          "Wa in nashaa nughriqhum falaa sareekha lahum wa laa hum yunqadhoon.",
          "Illaa rahmatam-minnaa wa mataa'an ilaa heen.",
          "Wa idhaa qeela lahumut-taqoo maa bayna aydeekum wa maa khalfakum la'allakum turhamoon.",
          "Wa maa ta'teehim min aayatim-min aayaati Rabbihim illaa kaanoo 'anhaa mu'rideen.",
          "Wa idhaa qeela lahum anfiqoo mimmaa razaqakumullaahu qaalal-ladheena kafaroo lil-ladheena aamanoo anut'imu mal-law yashaa'ullaahu at'amah; in antum illaa fee dalaalim-mubeen.",
          "Wa yaqooloona mataa haadhal-wa'du in kuntum saadiqeen.",
          "Maa yanzuroona illaa sayhatan waahidatan ta'khudhuhum wa hum yakhissimoon.",
          "Falaa yastatee'oona tawsiyatanw-wa laa ilaa ahlihim yarji'oon.",
        ],
      },
    ],
  },
  {
    ur: "سورۃ یٰس — چوتھا رکوع",
    ro: "Surah Yaseen (36) — 4th Ruku",
    rep: "once",
    items: [
      {
        ar: [
          "وَنُفِخَ فِي الصُّورِ فَإِذَا هُم مِّنَ الْأَجْدَاثِ إِلَىٰ رَبِّهِمْ يَنسِلُونَ",
          "قَالُوا يَا وَيْلَنَا مَن بَعَثَنَا مِن مَّرْقَدِنَا ۗ هَٰذَا مَا وَعَدَ الرَّحْمَٰنُ وَصَدَقَ الْمُرْسَلُونَ",
          "إِن كَانَتْ إِلَّا صَيْحَةً وَاحِدَةً فَإِذَا هُمْ جَمِيعٌ لَّدَيْنَا مُحْضَرُونَ",
          "فَالْيَوْمَ لَا تُظْلَمُ نَفْسٌ شَيْئًا وَلَا تُجْزَوْنَ إِلَّا مَا كُنتُمْ تَعْمَلُونَ",
          "إِنَّ أَصْحَابَ الْجَنَّةِ الْيَوْمَ فِي شُغُلٍ فَاكِهُونَ",
          "هُمْ وَأَزْوَاجُهُمْ فِي ظِلَالٍ عَلَى الْأَرَائِكِ مُتَّكِئُونَ",
          "لَهُمْ فِيهَا فَاكِهَةٌ وَلَهُم مَّا يَدَّعُونَ",
          "سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ",
          "وَامْتَازُوا الْيَوْمَ أَيُّهَا الْمُجْرِمُونَ",
          "أَلَمْ أَعْهَدْ إِلَيْكُمْ يَا بَنِي آدَمَ أَن لَّا تَعْبُدُوا الشَّيْطَانَ ۖ إِنَّهُ لَكُمْ عَدُوٌّ مُّبِينٌ",
          "وَأَنِ اعْبُدُونِي ۚ هَٰذَا صِرَاطٌ مُّسْتَقِيمٌ",
          "وَلَقَدْ أَضَلَّ مِنكُمْ جِبِلًّا كَثِيرًا ۖ أَفَلَمْ تَكُونُوا تَعْقِلُونَ",
          "هَٰذِهِ جَهَنَّمُ الَّتِي كُنتُمْ تُوعَدُونَ",
          "اصْلَوْهَا الْيَوْمَ بِمَا كُنتُمْ تَكْفُرُونَ",
          "الْيَوْمَ نَخْتِمُ عَلَىٰ أَفْوَاهِهِمْ وَتُكَلِّمُنَا أَيْدِيهِمْ وَتَشْهَدُ أَرْجُلُهُم بِمَا كَانُوا يَكْسِبُونَ",
          "وَلَوْ نَشَاءُ لَطَمَسْنَا عَلَىٰ أَعْيُنِهِمْ فَاسْتَبَقُوا الصِّرَاطَ فَأَنَّىٰ يُبْصِرُونَ",
          "وَلَوْ نَشَاءُ لَمَسَخْنَاهُمْ عَلَىٰ مَكَانَتِهِمْ فَمَا اسْتَطَاعُوا مُضِيًّا وَلَا يَرْجِعُونَ",
        ],
        rom: [
          "Wa nufikha fis-soori fa-idhaa hum minal-ajdaathi ilaa Rabbihim yansiloon.",
          "Qaaloo yaa waylanaa mam ba'athanaa mim marqadinaa; haadhaa maa wa'adar-Rahmaanu wa sadaqal-mursaloon.",
          "In kaanat illaa sayhatan waahidatan fa-idhaa hum jamee'ul-ladaynaa muhdaroon.",
          "Fal-yawma laa tuzlamu nafsun shay'anw-wa laa tujzawna illaa maa kuntum ta'maloon.",
          "Inna as-haabal-jannatil-yawma fee shughulin faakihoon.",
          "Hum wa azwaajuhum fee zilaalin 'alal-araa'iki muttaki'oon.",
          "Lahum feehaa faakihatunw-wa lahum maa yadda'oon.",
          "Salaamun qawlam-mir-Rabbir-Raheem.",
          "Wamtaazul-yawma ayyuhal-mujrimoon.",
          "Alam a'had ilaykum yaa banee aadama al-laa ta'budush-shaytaan; innahu lakum 'aduwwum-mubeen.",
          "Wa ani'budoonee; haadhaa siraatum-mustaqeem.",
          "Wa laqad adalla minkum jibillan katheeran; afalam takoonoo ta'qiloon.",
          "Haadhihee jahannamul-latee kuntum too'adoon.",
          "Islawhal-yawma bimaa kuntum takfuroon.",
          "Al-yawma nakhtimu 'alaa afwaahihim wa tukallimunaa aydeehim wa tashhadu arjuluhum bimaa kaanoo yaksiboon.",
          "Wa law nashaa'u latamasnaa 'alaa a'yunihim fastabaqus-siraata fa-annaa yubsiroon.",
          "Wa law nashaa'u lamasakhnaahum 'alaa makaanatihim famastataa'oo mudiyyanw-wa laa yarji'oon.",
        ],
      },
    ],
  },
  {
    ur: "سورۃ یٰس — پانچواں رکوع",
    ro: "Surah Yaseen (36) — 5th Ruku",
    rep: "once",
    items: [
      {
        ar: [
          "وَمَن نُّعَمِّرْهُ نُنَكِّسْهُ فِي الْخَلْقِ ۖ أَفَلَا يَعْقِلُونَ",
          "وَمَا عَلَّمْنَاهُ الشِّعْرَ وَمَا يَنبَغِي لَهُ ۚ إِنْ هُوَ إِلَّا ذِكْرٌ وَقُرْآنٌ مُّبِينٌ",
          "لِّيُنذِرَ مَن كَانَ حَيًّا وَيَحِقَّ الْقَوْلُ عَلَى الْكَافِرِينَ",
          "أَوَلَمْ يَرَوْا أَنَّا خَلَقْنَا لَهُم مِّمَّا عَمِلَتْ أَيْدِينَا أَنْعَامًا فَهُمْ لَهَا مَالِكُونَ",
          "وَذَلَّلْنَاهَا لَهُمْ فَمِنْهَا رَكُوبُهُمْ وَمِنْهَا يَأْكُلُونَ",
          "وَلَهُمْ فِيهَا مَنَافِعُ وَمَشَارِبُ ۖ أَفَلَا يَشْكُرُونَ",
          "وَاتَّخَذُوا مِن دُونِ اللَّهِ آلِهَةً لَّعَلَّهُمْ يُنصَرُونَ",
          "لَا يَسْتَطِيعُونَ نَصْرَهُمْ وَهُمْ لَهُمْ جُندٌ مُّحْضَرُونَ",
          "فَلَا يَحْزُنكَ قَوْلُهُمْ ۘ إِنَّا نَعْلَمُ مَا يُسِرُّونَ وَمَا يُعْلِنُونَ",
          "أَوَلَمْ يَرَ الْإِنسَانُ أَنَّا خَلَقْنَاهُ مِن نُّطْفَةٍ فَإِذَا هُوَ خَصِيمٌ مُّبِينٌ",
          "وَضَرَبَ لَنَا مَثَلًا وَنَسِيَ خَلْقَهُ ۖ قَالَ مَن يُحْيِي الْعِظَامَ وَهِيَ رَمِيمٌ",
          "قُلْ يُحْيِيهَا الَّذِي أَنشَأَهَا أَوَّلَ مَرَّةٍ ۖ وَهُوَ بِكُلِّ خَلْقٍ عَلِيمٌ",
          "الَّذِي جَعَلَ لَكُم مِّنَ الشَّجَرِ الْأَخْضَرِ نَارًا فَإِذَا أَنتُم مِّنْهُ تُوقِدُونَ",
          "أَوَلَيْسَ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ بِقَادِرٍ عَلَىٰ أَن يَخْلُقَ مِثْلَهُم ۚ بَلَىٰ وَهُوَ الْخَلَّاقُ الْعَلِيمُ",
          "إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ",
          "فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ",
        ],
        rom: [
          "Wa man nu'ammirhu nunakkishu fil-khalq; afalaa ya'qiloon.",
          "Wa maa 'allamnaahush-shi'ra wa maa yambaghee lah; in huwa illaa dhikruw-wa Qur'aanum-mubeen.",
          "Liyundhira man kaana hayyanw-wa yahiqqal-qawlu 'alal-kaafireen.",
          "Awalam yaraw annaa khalaqnaa lahum mimmaa 'amilat aydeenaa an'aaman fahum lahaa maalikoon.",
          "Wa dhallalnaahaa lahum faminhaa rakoobuhum wa minhaa ya'kuloon.",
          "Wa lahum feehaa manaafi'u wa mashaarib; afalaa yashkuroon.",
          "Wattakhadhoo min doonillaahi aalihatal-la'allahum yunsaroon.",
          "Laa yastatee'oona nasrahum wa hum lahum jundum-muhdaroon.",
          "Falaa yahzunka qawluhum; innaa na'lamu maa yusirroona wa maa yu'linoon.",
          "Awalam yaral-insaanu annaa khalaqnaahu min nutfatin fa-idhaa huwa khaseemum-mubeen.",
          "Wa daraba lanaa mathalanw-wa nasiya khalqah; qaala may-yuhyil-'izaama wa hiya rameem.",
          "Qul yuhyeehal-ladhee ansha'ahaa awwala marrah; wa huwa bikulli khalqin 'aleem.",
          "Alladhee ja'ala lakum minash-shajaril-akhdari naran fa-idhaa antum minhu tooqidoon.",
          "Awalaysal-ladhee khalaqas-samaawaati wal-arda biqaadirin 'alaa ay-yakhluqa mithlahum; balaa wa huwal-khallaaqul-'aleem.",
          "Innamaa amruhu idhaa araada shay'an ay-yaqoola lahu kun fayakoon.",
          "Fasubhaanal-ladhee biyadihee malakootu kulli shay'inw-wa ilayhi turja'oon.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- pages 25-55: Qasida Ghausia
  {
    ur: "قصیدہ غوثیہ",
    ro: "Qasida Ghausia",
    rep: "once",
    items: [
      {
        ar: ["سَقَانِي الْحُبُّ كَأْسَاتِ الْوِصَالِ", "فَقُلْتُ لِخَمْرَتِي نَحْوِي تَعَالِي"],
        rom: ["Saqaani-l-hubbu ka'saatil-wisaali", "Faqultu li-khamratee nahwee ta'aali"],
        en: [
          "The Beloved gave me cups of union to drink;",
          "so I told my ‘wine’: advance towards me.",
        ],
      },
      {
        ar: ["سَعَتْ وَمَشَتْ لِنَحْوِي فِي كُئُوسٍ", "فَهِمْتُ بِسُكْرَتِي بَيْنَ الْمَوَالِي"],
        rom: ["Sa'at wa mashat linahwee fee ku'oosin", "Fahimtu bisukratee baynal-mawaali"],
        en: [
          "Then it moved and walked towards me in cups;",
          "in my intoxication I understood the Friends in my midst.",
        ],
      },
      {
        ar: ["فَقُلْتُ لِسَائِرِ الْأَقْطَابِ لُمُّوا", "بِحَالِي وَادْخُلُوا أَنْتُمْ رِجَالِي"],
        rom: ["Faqultu li-saa'iril-aqtaabi lummoo", "Bihaalee wad-khuloo antum rijaalee"],
        en: [
          "I said to all the Poles (Qutbs): come and gather around my state,",
          "and enter, for you are my men.",
        ],
      },
      {
        ar: ["وَهِمُّوا وَاشْرَبُوا أَنْتُمْ جُنُودِي", "فَسَاقِي الْقَوْمِ بِالْوَافِي مَلَالِي"],
        rom: ["Wa himmoo washrabu antum junoodee", "Fasaaqil-qawmi bil-waafee malaalee"],
        en: [
          "Be resolute and drink — you are my army,",
          "for the Cup-Bearer of the people has filled my cup to the full.",
        ],
      },
      {
        ar: ["شَرِبْتُمْ فَضْلَتِي مِنْ بَعْدِ سُكْرِي", "وَلَا نِلْتُمْ عُلُوِّي وَاتِّصَالِي"],
        rom: ["Sharibtum fadlatee min ba'di sukree", "Wa laa niltum 'uluwwee wat-tisaalee"],
        en: [
          "You drank what I left after my intoxication,",
          "but you did not attain my height nor my union.",
        ],
      },
      {
        ar: ["مَقَامُكُمُ الْعُلَى جَمْعًا وَلَكِنْ", "مَقَامِي فَوْقَكُمْ مَا زَالَ عَالِي"],
        rom: ["Maqaamukumul-'ulaa jam'an walaakin", "Maqaamee fawqakum maa zaala 'aalee"],
        en: [
          "All your stations are high,",
          "but my station is higher still, ever.",
        ],
      },
      {
        ar: ["أَنَا فِي حَضْرَةِ التَّقْرِيبِ وَحْدِي", "يُصَرِّفُنِي وَحَسْبِي ذُو الْجَلَالِ"],
        rom: ["Anaa fee hadratit-taqreebi wahdee", "Yusarrifunee wa hasbee Dhul-Jalaali"],
        en: [
          "I am alone in the Court of Nearness;",
          "the Lord of Majesty directs me, and He suffices me.",
        ],
      },
      {
        ar: ["أَنَا الْبَازِيُّ أَشْهَبُ كُلِّ شَيْخٍ", "وَمَنْ ذَا فِي الرِّجَالِ أُعْطَى مِثَالِي"],
        rom: ["Anal-baaziyyu ash-habu kulli shaykhin", "Wa man dhaa fir-rijaali u'ta mithaalee"],
        en: [
          "I am the white falcon of every Shaykh;",
          "who among the men has been given the like of me?",
        ],
      },
      {
        ar: ["كَسَانِي خِلْعَةً بِطِرَازِ عَزْمٍ", "وَتَوَّجَنِي بِتِيجَانِ الْكَمَالِ"],
        rom: ["Kasaanee khil'atan bitiraazi 'azmin", "Wa tawwajanee bitijaanil-kamaali"],
        en: [
          "He robed me with a garment embroidered with resolve,",
          "and crowned me with the crowns of perfection.",
        ],
      },
      {
        ar: ["وَأَطْلَعَنِي عَلَى سِرٍّ قَدِيمٍ", "وَقَلَّدَنِي وَأَعْطَانِي سُؤَالِي"],
        rom: ["Wa at'la'anee 'alaa sirrin qadeemin", "Wa qalladanee wa a'taanee su'aalee"],
        en: [
          "He disclosed to me the ancient secret,",
          "He honoured me and granted my request.",
        ],
      },
      {
        ar: ["وَوَلَّانِي عَلَى الْأَقْطَابِ جَمْعًا", "فَحُكْمِي نَافِذٌ فِي كُلِّ حَالِ"],
        rom: ["Wa wallaanee 'alal-aqtaabi jam'an", "Fahukmee naafidhun fee kulli haali"],
        en: [
          "He made me ruler over all the Poles,",
          "so my command is effective in every state.",
        ],
      },
      {
        ar: ["فَلَوْ أَلْقَيْتُ سِرِّي فِي بِحَارٍ", "لَصَارَ الْكُلُّ غَوْرًا فِي الزَّوَالِ"],
        rom: ["Falaw alqaytu sirree fee bihaarin", "Lasaaral-kullu ghawran fiz-zawaali"],
        en: [
          "Had I thrown my secret into the oceans,",
          "all would have sunk and dried up at once.",
        ],
      },
      {
        ar: ["وَلَوْ أَلْقَيْتُ سِرِّي فِي جِبَالٍ", "لَدُكَّتْ وَاخْتَفَتْ بَيْنَ الرِّمَالِ"],
        rom: ["Wa law alqaytu sirree fee jibaalin", "Ladukkat wakh-tafat baynar-rimaali"],
        en: [
          "Had I thrown my secret upon mountains,",
          "they would have been crushed and vanished among the sands.",
        ],
      },
      {
        ar: ["وَلَوْ أَلْقَيْتُ سِرِّي فَوْقَ نَارٍ", "لَخَمَدَتْ وَانْطَفَتْ مِنْ سِرِّ حَالِي"],
        rom: ["Wa law alqaytu sirree fawqa naarin", "Lakhamadat wan-tafat min sirri haalee"],
        en: [
          "Had I thrown my secret upon fire,",
          "it would have died down and been extinguished by the secret of my state.",
        ],
      },
      {
        ar: ["وَلَوْ أَلْقَيْتُ سِرِّي فَوْقَ مَيْتٍ", "لَقَامَ بِقُدْرَةِ الْمَوْلَى سَعَى لِي"],
        rom: ["Wa law alqaytu sirree fawqa maytin", "Laqaama biqudratil-Mawlaa sa'aa lee"],
        en: [
          "Had I thrown my secret upon the dead,",
          "he would have risen by the power of the Lord and hastened to me.",
        ],
      },
      {
        ar: ["وَمَا مِنْهَا شُهُورٌ أَوْ دُهُورٌ", "تَمُرُّ وَتَنْقَضِي إِلَّا أَتَالِي"],
        rom: ["Wa maa minhaa shuhoorun aw duhoorun", "Tamurru wa tanqadee illaa ataalee"],
        en: [
          "No months or ages pass and come to an end,",
          "except that they come to me (and are within my knowledge).",
        ],
      },
      {
        ar: ["وَتُخْبِرُنِي بِمَا يَأْتِي وَيَجْرِي", "وَتُعْلِمُنِي فَأَقْصُرُ عَنْ جِدَالِي"],
        rom: ["Wa tukhbirunee bimaa ya'tee wa yajree", "Wa tu'limunee fa-aqsuru 'an jidaalee"],
        en: [
          "They inform me of what is to come and what occurs,",
          "and they teach me — so cease your disputing with me.",
        ],
      },
      {
        ar: ["مُرِيدِي هِمْ وَطِبْ وَاشْطَحْ وَغَنِّ", "وَافْعَلْ مَا تَشَاءُ فَالِاسْمُ عَالِي"],
        rom: ["Mureedee him wa tib washtah wa ghanni", "Waf'al maa tashaa'u fal-ismu 'aalee"],
        en: [
          "O my disciple, be resolute, rejoice, and sing in ecstasy,",
          "and do as you wish, for the Name is exalted.",
        ],
      },
      {
        ar: ["مُرِيدِي لَا تَخَفْ اللّٰهُ رَبِّي", "حَبَانِي رِفْعَةً نِلْتُ الْمَعَالِي"],
        rom: ["Mureedee laa takhaf Allaahu Rabbee", "Habaanee rif'atan niltul-ma'aalee"],
        en: [
          "Do not fear, my disciple — Allah is my Lord;",
          "He granted me elevation and I attained the heights.",
        ],
      },
      {
        ar: ["طُبُولِي فِي السَّمَاءِ وَالْأَرْضِ دُقَّتْ", "وَشَاؤُوسُ السَّعَادَةِ قَدْ بَدَا لِي"],
        rom: ["Tuboolee fis-samaa'i wal-ardi duqqat", "Wa shaa'oosus-sa'aadati qad badaa lee"],
        en: [
          "My drums have been beaten in the heavens and the earth,",
          "and the herald of good fortune has appeared to me.",
        ],
      },
      {
        ar: ["بِلَادُ اللّٰهِ مُلْكِي تَحْتَ حُكْمِي", "وَوَقْتِي قَبْلَ قَلْبِي قَدْ صَفَالِي"],
        rom: ["Bilaadullaahi mulkee tahta hukmee", "Wa waqtee qabla qalbee qad safaa lee"],
        en: [
          "The lands of Allah are my dominion, under my command;",
          "my time was purified even before my heart.",
        ],
      },
      {
        ar: ["نَظَرْتُ إِلَى بِلَادِ اللّٰهِ جَمْعًا", "كَخَرْدَلَةٍ عَلَى حُكْمِ اتِّصَالِ"],
        rom: ["Nazartu ilaa bilaadillaahi jam'an", "Kakhardalatin 'alaa hukmit-tisaali"],
        en: [
          "I cast a glance over all the lands of Allah;",
          "they appeared like a mustard seed, joined together.",
        ],
      },
      {
        ar: ["دَرَسْتُ الْعِلْمَ حَتَّى صِرْتُ قُطْبًا", "وَنِلْتُ السَّعْدَ مِنْ مَوْلَى الْمَوَالِي"],
        rom: ["Darastul-'ilma hattaa sirtu qutban", "Wa niltus-sa'da min Mawlal-mawaali"],
        en: [
          "I studied knowledge until I became a Qutb,",
          "and attained felicity from the Lord of lords.",
        ],
      },
      {
        ar: ["فَمَنْ فِي أَوْلِيَاءِ اللّٰهِ مِثْلِي", "وَمَنْ فِي الْعِلْمِ وَالتَّصْرِيفِ حَالِي"],
        rom: ["Faman fee awliyaa'illaahi mithlee", "Wa man fil-'ilmi wat-tasreefi haalee"],
        en: [
          "Who among the friends of Allah is like me?",
          "Who is like my state in knowledge and authority?",
        ],
      },
      {
        ar: ["رِجَالِي فِي هَوَاجِرِهِمْ صِيَامٌ", "وَفِي ظُلَمِ اللَّيَالِي كَاللَّآلِي"],
        rom: ["Rijaalee fee hawaajirihim siyaamun", "Wa fee zulamil-layaalee kal-la'aali"],
        en: [
          "My men fast in the scorching noon heat,",
          "and in the darkness of the nights they shine like pearls.",
        ],
      },
      {
        ar: ["وَكُلُّ وَلِيٍّ لَهُ قَدَمٌ وَإِنِّي", "عَلَى قَدَمِ النَّبِيِّ بَدْرِ الْكَمَالِ"],
        rom: ["Wa kullu waliyyin lahu qadamun wa innee", "'Alaa qadamin-Nabiyyi badril-kamaali"],
        en: [
          "Every Saint has a footstep (station), and I am",
          "upon the footstep of the Prophet, the full moon of perfection (peace be upon him).",
        ],
      },
      {
        ar: ["مُرِيدِي لَا تَخَفْ وَاشٍ فَإِنِّي", "عَزُومٌ قَاتِلٌ عِنْدَ الْقِتَالِ"],
        rom: ["Mureedee laa takhaf waashin fa-innee", "'Azoomun qaatilun 'indal-qitaali"],
        en: [
          "Fear not the slanderer, my disciple, for I am",
          "determined, a slayer in the battle.",
        ],
      },
      {
        ar: ["أَنَا الْجِيلِيُّ مُحْيِي الدِّينِ لَقَبِي", "وَأَعْلَامِي عَلَى رَأْسِ الْجِبَالِ"],
        rom: ["Anal-Jeeliyyu Muhyid-Deeni laqabee", "Wa a'laamee 'alaa ra'sil-jibaali"],
        en: [
          "I am Al-Jilani; Muhyiddin is my title,",
          "and my banners fly on the mountaintops.",
        ],
      },
      {
        ar: ["أَنَا الْحَسَنِيُّ وَالْمَخْدَعُ مَقَامِي", "وَأَقْدَامِي عَلَى عُنُقِ الرِّجَالِ"],
        rom: ["Anal-Hasaniyyu wal-makhda'u maqaamee", "Wa aqdaamee 'alaa 'unuqir-rijaali"],
        en: [
          "I am Hasani, and my cell is my abode,",
          "and my feet are upon the necks of the men (Saints).",
        ],
      },
      {
        ar: ["وَعَبْدُ الْقَادِرِ الْمَشْهُورُ اسْمِي", "وَجَدِّي صَاحِبُ الْعَيْنِ الْكَمَالِ"],
        rom: ["Wa 'Abdul-Qaadiril-mashhooru ismee", "Wa jaddee saahibul-'aynil-kamaali"],
        en: [
          "Abdul Qadir, the well-known, is my name,",
          "and my grandfather is the possessor of the eye of perfection.",
        ],
      },
      {
        ar: ["تَقَبَّلْنِي وَلَا تَرْدُدْ سُؤَالِي", "أَغِثْنِي سَيِّدِي انْظُرْ بِحَالِي"],
        rom: ["Taqabbalnee wa laa tardud su'aalee", "Aghithnee sayyidee unzur bi-haalee"],
        en: [
          "Accept me and do not reject my plea;",
          "help me, my master, and look upon my state.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- page 56
  {
    ur: "درود شریف (اختتام)",
    ro: "Durood Sharif (conclusion)",
    rep: "x111",
    items: [
      {
        ar: [
          "اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ",
          "مَعْدِنِ الْجُودِ وَالْكَرَمِ وَآلِهِ وَبَارِكْ وَسَلِّمْ",
        ],
        rom: [
          "Allahumma salli 'alaa Sayyidinaa wa Mawlaanaa Muhammadim",
          "Ma'danil-joodi wal-karami wa aalihi wa baarik wa sallim.",
        ],
        en: [
          "O Allah, send salutations, greetings and blessings upon our master and patron Muhammad (peace be upon him),",
          "the source of all goodness and generosity, and upon his family.",
        ],
      },
    ],
  },
];

/** Section → one block of lines (title tile first, then content). */
function sectionLines(section, lang) {
  if (section.raw) return section.raw[lang === "ur" ? "ur" : "ro"];
  const tbl = lang === "ur" ? UR : RO;
  const head = [lang === "ur" ? section.ur : section.ro, section.rep ? tbl[section.rep] : ""].filter(Boolean);
  const body = [];
  for (const item of section.items) {
    if (lang === "ur") {
      body.push(...item.ar);
    } else {
      const en = item.en ?? [];
      if (item.rom.length === 1 && en.length >= 1) body.push(item.rom[0], ...en);
      else body.push(...item.rom, ...en);
    }
  }
  return [...head, ...body];
}

function buildLyrics(lang) {
  return SECTIONS.map((s) => sectionLines(s, lang).join("\n")).join("\n\n");
}

export function buildRecord() {
  return {
    title_roman_english: TITLE_ROMAN,
    title_urdu: TITLE_URDU,
    author_name: AUTHOR_NAME,
    slug: SLUG,
    lyrics_urdu: buildLyrics("ur"),
    lyrics_roman_english: buildLyrics("ro"),
  };
}
