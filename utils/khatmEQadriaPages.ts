/**
 * Page-by-page text of the "Khatme Qadriah" PDF (58 pages: cover, instructions, 56 numbered pages).
 * Generated from scripts/data/khatm-e-qadria.mjs — one SECTION item per PDF page.
 */
export type ReaderPage = {
  /** Number printed in the PDF's page badge (undefined for cover / instructions). */
  badge?: number;
  /** Small caption in the top-left corner, e.g. "Durood Sharif 111 Times". */
  label?: string;
  arabic: string[];
  roman: string[];
  note?: string[];
  english: string[];
  /** Lay Arabic lines out in two columns (four-line couplets). */
  columns?: boolean;
  /** Arabic is a single flowing paragraph (Surah Yasin pages). */
  flow?: boolean;
};

export const KHATM_E_QADRIA_PAGES: ReaderPage[] = [
  {
    "badge": 1,
    "label": "Durood Sharif 111 Times",
    "arabic": [
      "اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ",
      "مَعْدِنِ الْجُودِ وَالْكَرَمِ وَآلِهِ وَبَارِكْ وَسَلِّمْ"
    ],
    "roman": [
      "Allahumma salli 'alaa Sayyidinaa wa Mawlaanaa Muhammadim",
      "Ma'danil-joodi wal-karami wa aalihi wa baarik wa sallim."
    ],
    "english": [
      "O Allah, send salutations, greetings and blessings upon our master and patron Muhammad (peace be upon him),",
      "the source of all goodness and generosity, and upon his family."
    ]
  },
  {
    "badge": 2,
    "label": "Third Kalimah 111 Times",
    "arabic": [
      "سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ",
      "وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيمِ"
    ],
    "roman": [
      "Subhaanallaahi wal-hamdu lillaahi wa laa ilaaha illallaahu wallaahu akbar.",
      "Wa laa hawla wa laa quwwata illaa billaahil-'Aliyyil-'Azeem."
    ],
    "english": [
      "Glorified is Allah and all praise is for Allah. There is no god but Allah, and Allah is the Greatest.",
      "There is no might or strength except through Allah, the Most High, the Most Great."
    ]
  },
  {
    "badge": 3,
    "label": "Surah Alam Nashrah 111 Times",
    "arabic": [
      "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنكَ وِزْرَكَ",
      "الَّذِي أَنقَضَ ظَهْرَكَ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَ",
      "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      "فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَبْ"
    ],
    "roman": [
      "Alam nashrah laka sadrak. Wa wada'naa 'anka wizrak.",
      "Alladhee anqada zahrak. Wa rafa'naa laka dhikrak.",
      "Fa-inna ma'al-'usri yusraa. Inna ma'al-'usri yusraa.",
      "Fa-idhaa faraghta fansab. Wa ilaa Rabbika farghab."
    ],
    "english": [
      "Have We not expanded your chest? And removed from you your burden,",
      "which had broken your back? And We have exalted for you your remembrance.",
      "Therefore, surely there is ease with hardship. Undoubtedly, there is ease with hardship.",
      "So when you are free (from prayer), strive hard in worship, and turn to your Lord alone."
    ]
  },
  {
    "badge": 4,
    "label": "Surah Ikhlaas 111 Times",
    "arabic": [
      "قُلْ هُوَ اللَّهُ أَحَدٌ",
      "اللَّهُ الصَّمَدُ",
      "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ"
    ],
    "roman": [
      "Qul huwallaahu ahad.",
      "Allaahus-samad.",
      "Lam yalid wa lam yoolad.",
      "Wa lam yakul-lahu kufuwan ahad."
    ],
    "english": [
      "Say: He is Allah, the One. Allah, the Independent, free of all needs.",
      "He does not give birth, nor was He born; and there is none equal to Him."
    ]
  },
  {
    "badge": 5,
    "label": "Recite 111 Times",
    "arabic": [
      "يَا بَاقِي أَنْتَ الْبَاقِي"
    ],
    "roman": [
      "Yaa Baaqi, antal Baaqi"
    ],
    "english": [
      "O Everlasting One, You are the Everlasting!"
    ]
  },
  {
    "badge": 6,
    "label": "Recite 111 Times",
    "arabic": [
      "يَا شَافِي أَنْتَ الشَّافِي"
    ],
    "roman": [
      "Yaa Shaafi, antash-Shaafi"
    ],
    "english": [
      "O Healer, You are the Healer!"
    ]
  },
  {
    "badge": 7,
    "label": "Recite 111 Times",
    "arabic": [
      "يَا كَافِي أَنْتَ الْكَافِي"
    ],
    "roman": [
      "Yaa Kaafi, antal Kaafi"
    ],
    "english": [
      "O Sufficient One, You are the All-Sufficient!"
    ]
  },
  {
    "badge": 8,
    "label": "Recite 11 Times",
    "arabic": [
      "يَا رَسُولَ اللّٰهِ انْظُرْ حَالَنَا",
      "يَا حَبِيبَ اللّٰهِ اسْمَعْ قَالَنَا",
      "إِنَّنِي فِي بَحْرِ هَمٍّ مُغْرَقُ",
      "خُذْ يَدِي سَهِّلْ لَنَا إِشْكَالَنَا"
    ],
    "columns": true,
    "roman": [
      "Yaa Rasoolallaahi unzur haalanaa",
      "Yaa Habeebal-laahi isma' qaalanaa",
      "Innanee fee bahri hammim mughraqun",
      "Khudh yadee sahhil lanaa ishkaalanaa"
    ],
    "english": [
      "O Messenger of Allah, look upon our state; O Beloved of Allah, listen to our plea.",
      "I am drowning in an ocean of grief — take my hand and ease our difficulties."
    ]
  },
  {
    "badge": 9,
    "label": "Recite 11 Times",
    "arabic": [
      "يَا حَبِيبَ الْإِلٰهِ خُذْ بِيَدِي",
      "مَا لِعَجْزِي سِوَاكَ مُسْتَنَدِي"
    ],
    "roman": [
      "Yaa Habeebal-Ilaahi khudh bi-yadee",
      "Maa li 'ajzee siwaaka mustanadee"
    ],
    "english": [
      "O Beloved of the Lord, take me by the hand.",
      "In my helplessness I have no support other than you."
    ]
  },
  {
    "badge": 10,
    "label": "Recite 11 Times",
    "arabic": [
      "فَسَهِّلْ يَا إِلٰهِي كُلَّ صَعْبٍ",
      "بِحُرْمَةِ سَيِّدِ الْأَبْرَارِ سَهِّلْ"
    ],
    "roman": [
      "Fasahhil yaa Ilaahee kulla sa'bin",
      "Bihurmati Sayyidil-Abraari sahhil"
    ],
    "english": [
      "O my God, make every difficulty easy for us;",
      "for the sake of the honour of the Master of the righteous (peace be upon him), make it easy."
    ]
  },
  {
    "badge": 11,
    "label": "Recite 11 Times",
    "arabic": [
      "يَا صِدِّيقُ يَا عُمَرُ يَا عُثْمَانُ يَا حَيْدَرُ",
      "دَفْعَ شَرٍّ كُنْ خَيْرَ آوَرْ يَا شَبِّيرُ يَا شَبَّرُ"
    ],
    "roman": [
      "Yaa Siddeeq, yaa Umar, yaa Uthmaan, yaa Haidar",
      "Daf'a sharri kun khayra aawar, yaa Shabbeer, yaa Shabbar"
    ],
    "english": [
      "O Siddiq, O Umar, O Uthman, O Haydar (Ali) — may Allah be pleased with them —",
      "and O Imam Hasan, O Imam Husain: please repel all evil and bless us with safety."
    ]
  },
  {
    "badge": 12,
    "label": "Recite 111 Times",
    "arabic": [
      "يَا حَضْرَتَ سُلْطَانَ شَيْخَ سَيِّدَ شَاهْ",
      "عَبْدَ الْقَادِرْ جِيلَانِي شَيْئًا لِلّٰهِ الْمَدَدْ"
    ],
    "roman": [
      "Yaa Hadrat Sultan Shaykh Sayyid Shah",
      "Abdul Qadir Jilani, shay'an lillaah, al-madad"
    ],
    "english": [
      "O Hazrat, Sultan of the Saints, Shaykh Sayyid Shah Abdul Qadir Jilani,",
      "for the sake of Allah, grant us your help!"
    ]
  },
  {
    "badge": 13,
    "label": "Recite 111 Times",
    "arabic": [
      "مَا هَمَهْ مُحْتَاجِ تُو حَاجَتْ رَوَا",
      "الْمَدَدْ يَا غَوْثِ أَعْظَمْ سَيِّدَا"
    ],
    "roman": [
      "Maa hamah muhtaaj, tu haajat rawaa",
      "Al-madad yaa Ghauth-e-A'zam Sayyidaa"
    ],
    "english": [
      "We are all needy, and you are the fulfiller of needs;",
      "help us, O Ghauth-e-A'zam, our master!"
    ]
  },
  {
    "badge": 14,
    "label": "Recite 111 Times",
    "arabic": [
      "مُشْكِلَاتِ بِي عَدَدْ دَارِيمْ مَا",
      "الْمَدَدْ يَا غَوْثِ أَعْظَمْ پِيرِ مَا"
    ],
    "roman": [
      "Mushkilaat-e-be-adad daareem maa",
      "Al-madad yaa Ghauth-e-A'zam peer-e-maa"
    ],
    "english": [
      "We are engulfed in countless difficulties.",
      "Help us, O Ghauth-e-A'zam, our spiritual guide!"
    ]
  },
  {
    "badge": 15,
    "label": "Recite 111 Times",
    "arabic": [
      "يَا حَضْرَتَ شَيْخَ مُحْيِي الدِّينْ",
      "مُشْكِلْ كُشَا بِالْخَيْرْ"
    ],
    "roman": [
      "Yaa Hadrat Shaykh Muhyiddeen",
      "Mushkil-kushaa bil-khayr"
    ],
    "english": [
      "O honourable Shaykh Muhyiddin (Abdul Qadir Jilani),",
      "reliever of difficulties — grant us goodness and safety!"
    ]
  },
  {
    "badge": 16,
    "label": "Recite 111 Times",
    "arabic": [
      "امْدَادْ كُنْ امْدَادْ كُنْ اَزْ بَنْدِ غَمْ آزَادْ كُنْ",
      "دَرْ دِينْ وَ دُنْيَا شَادْ كُنْ يَا غَوْثِ أَعْظَمْ دَسْتَگِيرْ"
    ],
    "roman": [
      "Imdaad kun, imdaad kun, az band-e-gham aazaad kun",
      "Dar deen-o-dunyaa shaad kun, yaa Ghauth-e-A'zam dastageer"
    ],
    "english": [
      "Help us, help us, free us from the bonds of grief;",
      "make us happy in religion and in this world, O Ghauth-e-A'zam, our helper!"
    ]
  },
  {
    "badge": 17,
    "label": "Recite 111 Times",
    "arabic": [
      "يَا حَضْرَتَ غَوْثْ، أَغِثْنَا بِإِذْنِ اللّٰهِ تَعَالَى"
    ],
    "roman": [
      "Yaa Hadrat Ghauth, aghithnaa bi-idhnillaahi Ta'aalaa"
    ],
    "english": [
      "O Hazrat Ghauth, help us by the permission of Allah, the Exalted."
    ]
  },
  {
    "badge": 18,
    "label": "Recite 111 Times",
    "arabic": [
      "خُذْ بِيَدِي يَا شَاهِ جِيلَانْ خُذْ بِيَدِي",
      "شَيْئًا لِلّٰهِ أَنْتَ نُورُ أَحْمَدِي"
    ],
    "roman": [
      "Khudh yadee yaa Shaah-e-Jeelaan khudh yadee",
      "Shay'an lillaah, anta noorun Ahmadee"
    ],
    "english": [
      "Take my hand, O Shah of Jilan, take my hand;",
      "for the sake of Allah — you are the light of Ahmad (peace be upon him)."
    ]
  },
  {
    "badge": 19,
    "label": "Recite 111 Times",
    "arabic": [
      "طُفَيْلِ حَضْرَتِ دَسْتَگِيرْ دُشْمَنْ هُوئے زِيرْ"
    ],
    "roman": [
      "Tufayl-e-Hadrat-e-Dastageer, dushman hu'ay zayr"
    ],
    "note": [
      "(Tap your hand on the floor with the intention of striking your enemy; this helps safeguard you from the enemy.)"
    ],
    "english": [
      "Through the blessing of Hazrat Dastageer (Ghauth-e-A'zam), may the enemy be overcome."
    ]
  },
  {
    "badge": 20,
    "label": "Surah Yasin 1st Ruku - Once",
    "arabic": [
      "يس ۝١ وَالْقُرْآنِ الْحَكِيمِ ۝٢ إِنَّكَ لَمِنَ الْمُرْسَلِينَ ۝٣ عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ ۝٤ تَنزِيلَ الْعَزِيزِ الرَّحِيمِ ۝٥ لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ ۝٦ لَقَدْ حَقَّ الْقَوْلُ عَلَىٰ أَكْثَرِهِمْ فَهُمْ لَا يُؤْمِنُونَ ۝٧ إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُم مُّقْمَحُونَ ۝٨ وَجَعَلْنَا مِن بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ ۝٩ وَسَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ ۝١٠ إِنَّمَا تُنذِرُ مَنِ اتَّبَعَ الذِّكْرَ وَخَشِيَ الرَّحْمَٰنَ بِالْغَيْبِ ۖ فَبَشِّرْهُ بِمَغْفِرَةٍ وَأَجْرٍ كَرِيمٍ ۝١١ إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ ۚ وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُّبِينٍ ۝١٢"
    ],
    "flow": true,
    "roman": [],
    "english": []
  },
  {
    "badge": 21,
    "label": "Surah Yasin 2nd Ruku - Once",
    "arabic": [
      "وَاضْرِبْ لَهُم مَّثَلًا أَصْحَابَ الْقَرْيَةِ إِذْ جَاءَهَا الْمُرْسَلُونَ ۝١٣ إِذْ أَرْسَلْنَا إِلَيْهِمُ اثْنَيْنِ فَكَذَّبُوهُمَا فَعَزَّزْنَا بِثَالِثٍ فَقَالُوا إِنَّا إِلَيْكُم مُّرْسَلُونَ ۝١٤ قَالُوا مَا أَنتُمْ إِلَّا بَشَرٌ مِّثْلُنَا وَمَا أَنزَلَ الرَّحْمَٰنُ مِن شَيْءٍ إِنْ أَنتُمْ إِلَّا تَكْذِبُونَ ۝١٥ قَالُوا رَبُّنَا يَعْلَمُ إِنَّا إِلَيْكُمْ لَمُرْسَلُونَ ۝١٦ وَمَا عَلَيْنَا إِلَّا الْبَلَاغُ الْمُبِينُ ۝١٧ قَالُوا إِنَّا تَطَيَّرْنَا بِكُمْ ۖ لَئِن لَّمْ تَنتَهُوا لَنَرْجُمَنَّكُمْ وَلَيَمَسَّنَّكُم مِّنَّا عَذَابٌ أَلِيمٌ ۝١٨ قَالُوا طَائِرُكُم مَّعَكُمْ ۚ أَئِن ذُكِّرْتُم ۚ بَلْ أَنتُمْ قَوْمٌ مُّسْرِفُونَ ۝١٩ وَجَاءَ مِنْ أَقْصَى الْمَدِينَةِ رَجُلٌ يَسْعَىٰ قَالَ يَا قَوْمِ اتَّبِعُوا الْمُرْسَلِينَ ۝٢٠ اتَّبِعُوا مَن لَّا يَسْأَلُكُمْ أَجْرًا وَهُم مُّهْتَدُونَ ۝٢١ وَمَا لِيَ لَا أَعْبُدُ الَّذِي فَطَرَنِي وَإِلَيْهِ تُرْجَعُونَ ۝٢٢ أَأَتَّخِذُ مِن دُونِهِ آلِهَةً إِن يُرِدْنِ الرَّحْمَٰنُ بِضُرٍّ لَّا تُغْنِ عَنِّي شَفَاعَتُهُمْ شَيْئًا وَلَا يُنقِذُونِ ۝٢٣ إِنِّي إِذًا لَّفِي ضَلَالٍ مُّبِينٍ ۝٢٤ إِنِّي آمَنتُ بِرَبِّكُمْ فَاسْمَعُونِ ۝٢٥ قِيلَ ادْخُلِ الْجَنَّةَ ۖ قَالَ يَا لَيْتَ قَوْمِي يَعْلَمُونَ ۝٢٦ بِمَا غَفَرَ لِي رَبِّي وَجَعَلَنِي مِنَ الْمُكْرَمِينَ ۝٢٧ وَمَا أَنزَلْنَا عَلَىٰ قَوْمِهِ مِن بَعْدِهِ مِن جُندٍ مِّنَ السَّمَاءِ وَمَا كُنَّا مُنزِلِينَ ۝٢٨ إِن كَانَتْ إِلَّا صَيْحَةً وَاحِدَةً فَإِذَا هُمْ خَامِدُونَ ۝٢٩ يَا حَسْرَةً عَلَى الْعِبَادِ ۚ مَا يَأْتِيهِم مِّن رَّسُولٍ إِلَّا كَانُوا بِهِ يَسْتَهْزِئُونَ ۝٣٠ أَلَمْ يَرَوْا كَمْ أَهْلَكْنَا قَبْلَهُم مِّنَ الْقُرُونِ أَنَّهُمْ إِلَيْهِمْ لَا يَرْجِعُونَ ۝٣١ وَإِن كُلٌّ لَّمَّا جَمِيعٌ لَّدَيْنَا مُحْضَرُونَ ۝٣٢"
    ],
    "flow": true,
    "roman": [],
    "english": []
  },
  {
    "badge": 22,
    "label": "Surah Yasin 3rd Ruku - Once",
    "arabic": [
      "وَآيَةٌ لَّهُمُ الْأَرْضُ الْمَيْتَةُ أَحْيَيْنَاهَا وَأَخْرَجْنَا مِنْهَا حَبًّا فَمِنْهُ يَأْكُلُونَ ۝٣٣ وَجَعَلْنَا فِيهَا جَنَّاتٍ مِّن نَّخِيلٍ وَأَعْنَابٍ وَفَجَّرْنَا فِيهَا مِنَ الْعُيُونِ ۝٣٤ لِيَأْكُلُوا مِن ثَمَرِهِ وَمَا عَمِلَتْهُ أَيْدِيهِمْ ۖ أَفَلَا يَشْكُرُونَ ۝٣٥ سُبْحَانَ الَّذِي خَلَقَ الْأَزْوَاجَ كُلَّهَا مِمَّا تُنبِتُ الْأَرْضُ وَمِنْ أَنفُسِهِمْ وَمِمَّا لَا يَعْلَمُونَ ۝٣٦ وَآيَةٌ لَّهُمُ اللَّيْلُ نَسْلَخُ مِنْهُ النَّهَارَ فَإِذَا هُم مُّظْلِمُونَ ۝٣٧ وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ ۝٣٨ وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ ۝٣٩ لَا الشَّمْسُ يَنبَغِي لَهَا أَن تُدْرِكَ الْقَمَرَ وَلَا اللَّيْلُ سَابِقُ النَّهَارِ ۚ وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ ۝٤٠ وَآيَةٌ لَّهُمْ أَنَّا حَمَلْنَا ذُرِّيَّتَهُمْ فِي الْفُلْكِ الْمَشْحُونِ ۝٤١ وَخَلَقْنَا لَهُم مِّن مِّثْلِهِ مَا يَرْكَبُونَ ۝٤٢ وَإِن نَّشَأْ نُغْرِقْهُمْ فَلَا صَرِيخَ لَهُمْ وَلَا هُمْ يُنقَذُونَ ۝٤٣ إِلَّا رَحْمَةً مِّنَّا وَمَتَاعًا إِلَىٰ حِينٍ ۝٤٤ وَإِذَا قِيلَ لَهُمُ اتَّقُوا مَا بَيْنَ أَيْدِيكُمْ وَمَا خَلْفَكُمْ لَعَلَّكُمْ تُرْحَمُونَ ۝٤٥ وَمَا تَأْتِيهِم مِّنْ آيَةٍ مِّنْ آيَاتِ رَبِّهِمْ إِلَّا كَانُوا عَنْهَا مُعْرِضِينَ ۝٤٦ وَإِذَا قِيلَ لَهُمْ أَنفِقُوا مِمَّا رَزَقَكُمُ اللَّهُ قَالَ الَّذِينَ كَفَرُوا لِلَّذِينَ آمَنُوا أَنُطْعِمُ مَن لَّوْ يَشَاءُ اللَّهُ أَطْعَمَهُ إِنْ أَنتُمْ إِلَّا فِي ضَلَالٍ مُّبِينٍ ۝٤٧ وَيَقُولُونَ مَتَىٰ هَٰذَا الْوَعْدُ إِن كُنتُمْ صَادِقِينَ ۝٤٨ مَا يَنظُرُونَ إِلَّا صَيْحَةً وَاحِدَةً تَأْخُذُهُمْ وَهُمْ يَخِصِّمُونَ ۝٤٩ فَلَا يَسْتَطِيعُونَ تَوْصِيَةً وَلَا إِلَىٰ أَهْلِهِمْ يَرْجِعُونَ ۝٥٠"
    ],
    "flow": true,
    "roman": [],
    "english": []
  },
  {
    "badge": 23,
    "label": "Surah Yasin 4th Ruku - Once",
    "arabic": [
      "وَنُفِخَ فِي الصُّورِ فَإِذَا هُم مِّنَ الْأَجْدَاثِ إِلَىٰ رَبِّهِمْ يَنسِلُونَ ۝٥١ قَالُوا يَا وَيْلَنَا مَن بَعَثَنَا مِن مَّرْقَدِنَا ۗ هَٰذَا مَا وَعَدَ الرَّحْمَٰنُ وَصَدَقَ الْمُرْسَلُونَ ۝٥٢ إِن كَانَتْ إِلَّا صَيْحَةً وَاحِدَةً فَإِذَا هُمْ جَمِيعٌ لَّدَيْنَا مُحْضَرُونَ ۝٥٣ فَالْيَوْمَ لَا تُظْلَمُ نَفْسٌ شَيْئًا وَلَا تُجْزَوْنَ إِلَّا مَا كُنتُمْ تَعْمَلُونَ ۝٥٤ إِنَّ أَصْحَابَ الْجَنَّةِ الْيَوْمَ فِي شُغُلٍ فَاكِهُونَ ۝٥٥ هُمْ وَأَزْوَاجُهُمْ فِي ظِلَالٍ عَلَى الْأَرَائِكِ مُتَّكِئُونَ ۝٥٦ لَهُمْ فِيهَا فَاكِهَةٌ وَلَهُم مَّا يَدَّعُونَ ۝٥٧ سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ ۝٥٨ وَامْتَازُوا الْيَوْمَ أَيُّهَا الْمُجْرِمُونَ ۝٥٩ أَلَمْ أَعْهَدْ إِلَيْكُمْ يَا بَنِي آدَمَ أَن لَّا تَعْبُدُوا الشَّيْطَانَ ۖ إِنَّهُ لَكُمْ عَدُوٌّ مُّبِينٌ ۝٦٠ وَأَنِ اعْبُدُونِي ۚ هَٰذَا صِرَاطٌ مُّسْتَقِيمٌ ۝٦١ وَلَقَدْ أَضَلَّ مِنكُمْ جِبِلًّا كَثِيرًا ۖ أَفَلَمْ تَكُونُوا تَعْقِلُونَ ۝٦٢ هَٰذِهِ جَهَنَّمُ الَّتِي كُنتُمْ تُوعَدُونَ ۝٦٣ اصْلَوْهَا الْيَوْمَ بِمَا كُنتُمْ تَكْفُرُونَ ۝٦٤ الْيَوْمَ نَخْتِمُ عَلَىٰ أَفْوَاهِهِمْ وَتُكَلِّمُنَا أَيْدِيهِمْ وَتَشْهَدُ أَرْجُلُهُم بِمَا كَانُوا يَكْسِبُونَ ۝٦٥ وَلَوْ نَشَاءُ لَطَمَسْنَا عَلَىٰ أَعْيُنِهِمْ فَاسْتَبَقُوا الصِّرَاطَ فَأَنَّىٰ يُبْصِرُونَ ۝٦٦ وَلَوْ نَشَاءُ لَمَسَخْنَاهُمْ عَلَىٰ مَكَانَتِهِمْ فَمَا اسْتَطَاعُوا مُضِيًّا وَلَا يَرْجِعُونَ ۝٦٧"
    ],
    "flow": true,
    "roman": [],
    "english": []
  },
  {
    "badge": 24,
    "label": "Surah Yasin 5th Ruku - Once",
    "arabic": [
      "وَمَن نُّعَمِّرْهُ نُنَكِّسْهُ فِي الْخَلْقِ ۖ أَفَلَا يَعْقِلُونَ ۝٦٨ وَمَا عَلَّمْنَاهُ الشِّعْرَ وَمَا يَنبَغِي لَهُ ۚ إِنْ هُوَ إِلَّا ذِكْرٌ وَقُرْآنٌ مُّبِينٌ ۝٦٩ لِّيُنذِرَ مَن كَانَ حَيًّا وَيَحِقَّ الْقَوْلُ عَلَى الْكَافِرِينَ ۝٧٠ أَوَلَمْ يَرَوْا أَنَّا خَلَقْنَا لَهُم مِّمَّا عَمِلَتْ أَيْدِينَا أَنْعَامًا فَهُمْ لَهَا مَالِكُونَ ۝٧١ وَذَلَّلْنَاهَا لَهُمْ فَمِنْهَا رَكُوبُهُمْ وَمِنْهَا يَأْكُلُونَ ۝٧٢ وَلَهُمْ فِيهَا مَنَافِعُ وَمَشَارِبُ ۖ أَفَلَا يَشْكُرُونَ ۝٧٣ وَاتَّخَذُوا مِن دُونِ اللَّهِ آلِهَةً لَّعَلَّهُمْ يُنصَرُونَ ۝٧٤ لَا يَسْتَطِيعُونَ نَصْرَهُمْ وَهُمْ لَهُمْ جُندٌ مُّحْضَرُونَ ۝٧٥ فَلَا يَحْزُنكَ قَوْلُهُمْ ۘ إِنَّا نَعْلَمُ مَا يُسِرُّونَ وَمَا يُعْلِنُونَ ۝٧٦ أَوَلَمْ يَرَ الْإِنسَانُ أَنَّا خَلَقْنَاهُ مِن نُّطْفَةٍ فَإِذَا هُوَ خَصِيمٌ مُّبِينٌ ۝٧٧ وَضَرَبَ لَنَا مَثَلًا وَنَسِيَ خَلْقَهُ ۖ قَالَ مَن يُحْيِي الْعِظَامَ وَهِيَ رَمِيمٌ ۝٧٨ قُلْ يُحْيِيهَا الَّذِي أَنشَأَهَا أَوَّلَ مَرَّةٍ ۖ وَهُوَ بِكُلِّ خَلْقٍ عَلِيمٌ ۝٧٩ الَّذِي جَعَلَ لَكُم مِّنَ الشَّجَرِ الْأَخْضَرِ نَارًا فَإِذَا أَنتُم مِّنْهُ تُوقِدُونَ ۝٨٠ أَوَلَيْسَ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ بِقَادِرٍ عَلَىٰ أَن يَخْلُقَ مِثْلَهُم ۚ بَلَىٰ وَهُوَ الْخَلَّاقُ الْعَلِيمُ ۝٨١ إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ ۝٨٢ فَسُبْحَانَ الَّذِي بِيَدِهِ مَلَكُوتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُونَ ۝٨٣"
    ],
    "flow": true,
    "roman": [],
    "english": []
  },
  {
    "badge": 25,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "سَقَانِي الْحُبُّ كَأْسَاتِ الْوِصَالِ",
      "فَقُلْتُ لِخَمْرَتِي نَحْوِي تَعَالِي"
    ],
    "roman": [
      "Saqaani-l-hubbu ka'saatil-wisaali",
      "Faqultu li-khamratee nahwee ta'aali"
    ],
    "english": [
      "The Beloved gave me cups of union to drink;",
      "so I told my ‘wine’: advance towards me."
    ]
  },
  {
    "badge": 26,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "سَعَتْ وَمَشَتْ لِنَحْوِي فِي كُئُوسٍ",
      "فَهِمْتُ بِسُكْرَتِي بَيْنَ الْمَوَالِي"
    ],
    "roman": [
      "Sa'at wa mashat linahwee fee ku'oosin",
      "Fahimtu bisukratee baynal-mawaali"
    ],
    "english": [
      "Then it moved and walked towards me in cups;",
      "in my intoxication I understood the Friends in my midst."
    ]
  },
  {
    "badge": 27,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "فَقُلْتُ لِسَائِرِ الْأَقْطَابِ لُمُّوا",
      "بِحَالِي وَادْخُلُوا أَنْتُمْ رِجَالِي"
    ],
    "roman": [
      "Faqultu li-saa'iril-aqtaabi lummoo",
      "Bihaalee wad-khuloo antum rijaalee"
    ],
    "english": [
      "I said to all the Poles (Qutbs): come and gather around my state,",
      "and enter, for you are my men."
    ]
  },
  {
    "badge": 28,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَهِمُّوا وَاشْرَبُوا أَنْتُمْ جُنُودِي",
      "فَسَاقِي الْقَوْمِ بِالْوَافِي مَلَالِي"
    ],
    "roman": [
      "Wa himmoo washrabu antum junoodee",
      "Fasaaqil-qawmi bil-waafee malaalee"
    ],
    "english": [
      "Be resolute and drink — you are my army,",
      "for the Cup-Bearer of the people has filled my cup to the full."
    ]
  },
  {
    "badge": 29,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "شَرِبْتُمْ فَضْلَتِي مِنْ بَعْدِ سُكْرِي",
      "وَلَا نِلْتُمْ عُلُوِّي وَاتِّصَالِي"
    ],
    "roman": [
      "Sharibtum fadlatee min ba'di sukree",
      "Wa laa niltum 'uluwwee wat-tisaalee"
    ],
    "english": [
      "You drank what I left after my intoxication,",
      "but you did not attain my height nor my union."
    ]
  },
  {
    "badge": 30,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "مَقَامُكُمُ الْعُلَى جَمْعًا وَلَكِنْ",
      "مَقَامِي فَوْقَكُمْ مَا زَالَ عَالِي"
    ],
    "roman": [
      "Maqaamukumul-'ulaa jam'an walaakin",
      "Maqaamee fawqakum maa zaala 'aalee"
    ],
    "english": [
      "All your stations are high,",
      "but my station is higher still, ever."
    ]
  },
  {
    "badge": 31,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "أَنَا فِي حَضْرَةِ التَّقْرِيبِ وَحْدِي",
      "يُصَرِّفُنِي وَحَسْبِي ذُو الْجَلَالِ"
    ],
    "roman": [
      "Anaa fee hadratit-taqreebi wahdee",
      "Yusarrifunee wa hasbee Dhul-Jalaali"
    ],
    "english": [
      "I am alone in the Court of Nearness;",
      "the Lord of Majesty directs me, and He suffices me."
    ]
  },
  {
    "badge": 32,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "أَنَا الْبَازِيُّ أَشْهَبُ كُلِّ شَيْخٍ",
      "وَمَنْ ذَا فِي الرِّجَالِ أُعْطَى مِثَالِي"
    ],
    "roman": [
      "Anal-baaziyyu ash-habu kulli shaykhin",
      "Wa man dhaa fir-rijaali u'ta mithaalee"
    ],
    "english": [
      "I am the white falcon of every Shaykh;",
      "who among the men has been given the like of me?"
    ]
  },
  {
    "badge": 33,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "كَسَانِي خِلْعَةً بِطِرَازِ عَزْمٍ",
      "وَتَوَّجَنِي بِتِيجَانِ الْكَمَالِ"
    ],
    "roman": [
      "Kasaanee khil'atan bitiraazi 'azmin",
      "Wa tawwajanee bitijaanil-kamaali"
    ],
    "english": [
      "He robed me with a garment embroidered with resolve,",
      "and crowned me with the crowns of perfection."
    ]
  },
  {
    "badge": 34,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَأَطْلَعَنِي عَلَى سِرٍّ قَدِيمٍ",
      "وَقَلَّدَنِي وَأَعْطَانِي سُؤَالِي"
    ],
    "roman": [
      "Wa at'la'anee 'alaa sirrin qadeemin",
      "Wa qalladanee wa a'taanee su'aalee"
    ],
    "english": [
      "He disclosed to me the ancient secret,",
      "He honoured me and granted my request."
    ]
  },
  {
    "badge": 35,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَوَلَّانِي عَلَى الْأَقْطَابِ جَمْعًا",
      "فَحُكْمِي نَافِذٌ فِي كُلِّ حَالِ"
    ],
    "roman": [
      "Wa wallaanee 'alal-aqtaabi jam'an",
      "Fahukmee naafidhun fee kulli haali"
    ],
    "english": [
      "He made me ruler over all the Poles,",
      "so my command is effective in every state."
    ]
  },
  {
    "badge": 36,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "فَلَوْ أَلْقَيْتُ سِرِّي فِي بِحَارٍ",
      "لَصَارَ الْكُلُّ غَوْرًا فِي الزَّوَالِ"
    ],
    "roman": [
      "Falaw alqaytu sirree fee bihaarin",
      "Lasaaral-kullu ghawran fiz-zawaali"
    ],
    "english": [
      "Had I thrown my secret into the oceans,",
      "all would have sunk and dried up at once."
    ]
  },
  {
    "badge": 37,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَلَوْ أَلْقَيْتُ سِرِّي فِي جِبَالٍ",
      "لَدُكَّتْ وَاخْتَفَتْ بَيْنَ الرِّمَالِ"
    ],
    "roman": [
      "Wa law alqaytu sirree fee jibaalin",
      "Ladukkat wakh-tafat baynar-rimaali"
    ],
    "english": [
      "Had I thrown my secret upon mountains,",
      "they would have been crushed and vanished among the sands."
    ]
  },
  {
    "badge": 38,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَلَوْ أَلْقَيْتُ سِرِّي فَوْقَ نَارٍ",
      "لَخَمَدَتْ وَانْطَفَتْ مِنْ سِرِّ حَالِي"
    ],
    "roman": [
      "Wa law alqaytu sirree fawqa naarin",
      "Lakhamadat wan-tafat min sirri haalee"
    ],
    "english": [
      "Had I thrown my secret upon fire,",
      "it would have died down and been extinguished by the secret of my state."
    ]
  },
  {
    "badge": 39,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَلَوْ أَلْقَيْتُ سِرِّي فَوْقَ مَيْتٍ",
      "لَقَامَ بِقُدْرَةِ الْمَوْلَى سَعَى لِي"
    ],
    "roman": [
      "Wa law alqaytu sirree fawqa maytin",
      "Laqaama biqudratil-Mawlaa sa'aa lee"
    ],
    "english": [
      "Had I thrown my secret upon the dead,",
      "he would have risen by the power of the Lord and hastened to me."
    ]
  },
  {
    "badge": 40,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَمَا مِنْهَا شُهُورٌ أَوْ دُهُورٌ",
      "تَمُرُّ وَتَنْقَضِي إِلَّا أَتَالِي"
    ],
    "roman": [
      "Wa maa minhaa shuhoorun aw duhoorun",
      "Tamurru wa tanqadee illaa ataalee"
    ],
    "english": [
      "No months or ages pass and come to an end,",
      "except that they come to me (and are within my knowledge)."
    ]
  },
  {
    "badge": 41,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَتُخْبِرُنِي بِمَا يَأْتِي وَيَجْرِي",
      "وَتُعْلِمُنِي فَأَقْصُرُ عَنْ جِدَالِي"
    ],
    "roman": [
      "Wa tukhbirunee bimaa ya'tee wa yajree",
      "Wa tu'limunee fa-aqsuru 'an jidaalee"
    ],
    "english": [
      "They inform me of what is to come and what occurs,",
      "and they teach me — so cease your disputing with me."
    ]
  },
  {
    "badge": 42,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "مُرِيدِي هِمْ وَطِبْ وَاشْطَحْ وَغَنِّ",
      "وَافْعَلْ مَا تَشَاءُ فَالِاسْمُ عَالِي"
    ],
    "roman": [
      "Mureedee him wa tib washtah wa ghanni",
      "Waf'al maa tashaa'u fal-ismu 'aalee"
    ],
    "english": [
      "O my disciple, be resolute, rejoice, and sing in ecstasy,",
      "and do as you wish, for the Name is exalted."
    ]
  },
  {
    "badge": 43,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "مُرِيدِي لَا تَخَفْ اللّٰهُ رَبِّي",
      "حَبَانِي رِفْعَةً نِلْتُ الْمَعَالِي"
    ],
    "roman": [
      "Mureedee laa takhaf Allaahu Rabbee",
      "Habaanee rif'atan niltul-ma'aalee"
    ],
    "english": [
      "Do not fear, my disciple — Allah is my Lord;",
      "He granted me elevation and I attained the heights."
    ]
  },
  {
    "badge": 44,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "طُبُولِي فِي السَّمَاءِ وَالْأَرْضِ دُقَّتْ",
      "وَشَاؤُوسُ السَّعَادَةِ قَدْ بَدَا لِي"
    ],
    "roman": [
      "Tuboolee fis-samaa'i wal-ardi duqqat",
      "Wa shaa'oosus-sa'aadati qad badaa lee"
    ],
    "english": [
      "My drums have been beaten in the heavens and the earth,",
      "and the herald of good fortune has appeared to me."
    ]
  },
  {
    "badge": 45,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "بِلَادُ اللّٰهِ مُلْكِي تَحْتَ حُكْمِي",
      "وَوَقْتِي قَبْلَ قَلْبِي قَدْ صَفَالِي"
    ],
    "roman": [
      "Bilaadullaahi mulkee tahta hukmee",
      "Wa waqtee qabla qalbee qad safaa lee"
    ],
    "english": [
      "The lands of Allah are my dominion, under my command;",
      "my time was purified even before my heart."
    ]
  },
  {
    "badge": 46,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "نَظَرْتُ إِلَى بِلَادِ اللّٰهِ جَمْعًا",
      "كَخَرْدَلَةٍ عَلَى حُكْمِ اتِّصَالِ"
    ],
    "roman": [
      "Nazartu ilaa bilaadillaahi jam'an",
      "Kakhardalatin 'alaa hukmit-tisaali"
    ],
    "english": [
      "I cast a glance over all the lands of Allah;",
      "they appeared like a mustard seed, joined together."
    ]
  },
  {
    "badge": 47,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "دَرَسْتُ الْعِلْمَ حَتَّى صِرْتُ قُطْبًا",
      "وَنِلْتُ السَّعْدَ مِنْ مَوْلَى الْمَوَالِي"
    ],
    "roman": [
      "Darastul-'ilma hattaa sirtu qutban",
      "Wa niltus-sa'da min Mawlal-mawaali"
    ],
    "english": [
      "I studied knowledge until I became a Qutb,",
      "and attained felicity from the Lord of lords."
    ]
  },
  {
    "badge": 48,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "فَمَنْ فِي أَوْلِيَاءِ اللّٰهِ مِثْلِي",
      "وَمَنْ فِي الْعِلْمِ وَالتَّصْرِيفِ حَالِي"
    ],
    "roman": [
      "Faman fee awliyaa'illaahi mithlee",
      "Wa man fil-'ilmi wat-tasreefi haalee"
    ],
    "english": [
      "Who among the friends of Allah is like me?",
      "Who is like my state in knowledge and authority?"
    ]
  },
  {
    "badge": 49,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "رِجَالِي فِي هَوَاجِرِهِمْ صِيَامٌ",
      "وَفِي ظُلَمِ اللَّيَالِي كَاللَّآلِي"
    ],
    "roman": [
      "Rijaalee fee hawaajirihim siyaamun",
      "Wa fee zulamil-layaalee kal-la'aali"
    ],
    "english": [
      "My men fast in the scorching noon heat,",
      "and in the darkness of the nights they shine like pearls."
    ]
  },
  {
    "badge": 50,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَكُلُّ وَلِيٍّ لَهُ قَدَمٌ وَإِنِّي",
      "عَلَى قَدَمِ النَّبِيِّ بَدْرِ الْكَمَالِ"
    ],
    "roman": [
      "Wa kullu waliyyin lahu qadamun wa innee",
      "'Alaa qadamin-Nabiyyi badril-kamaali"
    ],
    "english": [
      "Every Saint has a footstep (station), and I am",
      "upon the footstep of the Prophet, the full moon of perfection (peace be upon him)."
    ]
  },
  {
    "badge": 51,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "مُرِيدِي لَا تَخَفْ وَاشٍ فَإِنِّي",
      "عَزُومٌ قَاتِلٌ عِنْدَ الْقِتَالِ"
    ],
    "roman": [
      "Mureedee laa takhaf waashin fa-innee",
      "'Azoomun qaatilun 'indal-qitaali"
    ],
    "english": [
      "Fear not the slanderer, my disciple, for I am",
      "determined, a slayer in the battle."
    ]
  },
  {
    "badge": 52,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "أَنَا الْجِيلِيُّ مُحْيِي الدِّينِ لَقَبِي",
      "وَأَعْلَامِي عَلَى رَأْسِ الْجِبَالِ"
    ],
    "roman": [
      "Anal-Jeeliyyu Muhyid-Deeni laqabee",
      "Wa a'laamee 'alaa ra'sil-jibaali"
    ],
    "english": [
      "I am Al-Jilani; Muhyiddin is my title,",
      "and my banners fly on the mountaintops."
    ]
  },
  {
    "badge": 53,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "أَنَا الْحَسَنِيُّ وَالْمَخْدَعُ مَقَامِي",
      "وَأَقْدَامِي عَلَى عُنُقِ الرِّجَالِ"
    ],
    "roman": [
      "Anal-Hasaniyyu wal-makhda'u maqaamee",
      "Wa aqdaamee 'alaa 'unuqir-rijaali"
    ],
    "english": [
      "I am Hasani, and my cell is my abode,",
      "and my feet are upon the necks of the men (Saints)."
    ]
  },
  {
    "badge": 54,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "وَعَبْدُ الْقَادِرِ الْمَشْهُورُ اسْمِي",
      "وَجَدِّي صَاحِبُ الْعَيْنِ الْكَمَالِ"
    ],
    "roman": [
      "Wa 'Abdul-Qaadiril-mashhooru ismee",
      "Wa jaddee saahibul-'aynil-kamaali"
    ],
    "english": [
      "Abdul Qadir, the well-known, is my name,",
      "and my grandfather is the possessor of the eye of perfection."
    ]
  },
  {
    "badge": 55,
    "label": "Qaseedah Ghauthiah - Once",
    "arabic": [
      "تَقَبَّلْنِي وَلَا تَرْدُدْ سُؤَالِي",
      "أَغِثْنِي سَيِّدِي انْظُرْ بِحَالِي"
    ],
    "roman": [
      "Taqabbalnee wa laa tardud su'aalee",
      "Aghithnee sayyidee unzur bi-haalee"
    ],
    "english": [
      "Accept me and do not reject my plea;",
      "help me, my master, and look upon my state."
    ]
  },
  {
    "badge": 56,
    "label": "Durood Sharif 111 Times",
    "arabic": [
      "اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ",
      "مَعْدِنِ الْجُودِ وَالْكَرَمِ وَآلِهِ وَبَارِكْ وَسَلِّمْ"
    ],
    "roman": [
      "Allahumma salli 'alaa Sayyidinaa wa Mawlaanaa Muhammadim",
      "Ma'danil-joodi wal-karami wa aalihi wa baarik wa sallim."
    ],
    "english": [
      "O Allah, send salutations, greetings and blessings upon our master and patron Muhammad (peace be upon him),",
      "the source of all goodness and generosity, and upon his family."
    ]
  }
];
