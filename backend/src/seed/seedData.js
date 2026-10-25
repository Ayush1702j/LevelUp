require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Vocabulary = require('../models/Vocabulary');
const Grammar = require('../models/Grammar');
const Achievement = require('../models/Achievement');
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Progress = require('../models/Progress');
const Thought = require('../models/Thought');
const UserAchievement = require('../models/UserAchievement');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/levelup';
  await mongoose.connect(uri);
  console.log(`[Seed] Connected to MongoDB at ${uri}`);
};

const speakingChallenges = [
  {
    title: 'Describe Your Favorite Technology',
    description: 'Explain a piece of technology you use every day, why you love it, and how it improves your daily life.',
    category: 'Speaking',
    difficulty: 'Easy',
    points: 20,
    promptDetails: 'Focus on clear pronunciation, transition words (e.g., furthermore, specifically), and maintaining a steady pace.',
    estimatedTime: '1 min'
  },
  {
    title: 'A Challenge You Overcame',
    description: 'Speak about a difficult situation or setback you experienced and how you found a solution.',
    category: 'Speaking',
    difficulty: 'Medium',
    points: 20,
    promptDetails: 'Structure your speech: 1. The challenge, 2. The action taken, 3. The lesson learned.',
    estimatedTime: '1 min'
  },
  {
    title: 'Review a Book or Movie You Love',
    description: 'Provide an engaging 60-second summary and review of a story that inspired you without giving major spoilers.',
    category: 'Speaking',
    difficulty: 'Easy',
    points: 20,
    promptDetails: 'Use descriptive adjectives (gripping, thought-provoking, unforgettable) and expressive tone.',
    estimatedTime: '1 min'
  },
  {
    title: 'Your Ideal Morning Routine',
    description: 'Describe step-by-step how your dream productive morning looks from the moment you wake up.',
    category: 'Speaking',
    difficulty: 'Easy',
    points: 20,
    promptDetails: 'Use sequencing markers: first, next, subsequently, and finally.',
    estimatedTime: '1 min'
  },
  {
    title: 'Pitch Your Dream Project',
    description: 'Imagine you have 1 minute to pitch an innovative app, business, or community idea to an investor.',
    category: 'Speaking',
    difficulty: 'Hard',
    points: 25,
    promptDetails: 'Focus on a strong hook, clear problem statement, unique value proposition, and a memorable conclusion.',
    estimatedTime: '1 min'
  },
  {
    title: 'The Best Advice You Ever Received',
    description: 'Share a valuable piece of advice someone gave you and how it influenced your decisions.',
    category: 'Speaking',
    difficulty: 'Medium',
    points: 20,
    promptDetails: 'Explain the context, who said it, and give a specific example of applying it.',
    estimatedTime: '1 min'
  },
  {
    title: 'How You Handle Stress and Pressure',
    description: 'Talk through your favorite strategies for staying calm, centered, and resilient under deadlines.',
    category: 'Speaking',
    difficulty: 'Medium',
    points: 20,
    promptDetails: 'Keep your vocal delivery grounded and avoid filler words like "um" and "like".',
    estimatedTime: '1 min'
  },
  {
    title: 'Describe a Place You Want to Visit',
    description: 'Describe a city, country, or landscape you dream of visiting and what you would do there.',
    category: 'Speaking',
    difficulty: 'Easy',
    points: 20,
    promptDetails: 'Invoke sensory language: sight, sounds, atmosphere, and local cuisine.',
    estimatedTime: '1 min'
  },
  {
    title: 'Explain a Complex Concept Simply',
    description: 'Take a technical concept (e.g. APIs, caching, compound interest) and explain it as if to a 10-year-old.',
    category: 'Speaking',
    difficulty: 'Hard',
    points: 25,
    promptDetails: 'Use everyday analogies and avoid unnecessary jargon.',
    estimatedTime: '1 min'
  },
  {
    title: 'Reflecting on Personal Growth',
    description: 'Compare who you were two years ago with who you are today. What has been your biggest shift?',
    category: 'Speaking',
    difficulty: 'Medium',
    points: 20,
    promptDetails: 'Reflect on mindset, skills, and interpersonal communication.',
    estimatedTime: '1 min'
  }
];

const generalChallenges = [
  {
    title: 'Daily Priority Deep Work',
    description: 'Complete 45 minutes of unbroken focus on your highest priority coding or study assignment.',
    category: 'Productivity',
    difficulty: 'Medium',
    points: 15,
    promptDetails: 'Silence notifications and keep only relevant tabs open.',
    estimatedTime: '45 mins'
  },
  {
    title: 'Inbox & Workspace Cleanse',
    description: 'Clear your digital desktop, close unused browser tabs, and archive answered emails.',
    category: 'Productivity',
    difficulty: 'Easy',
    points: 10,
    promptDetails: 'A clean digital environment fosters clear focus.',
    estimatedTime: '10 mins'
  },
  {
    title: 'Positive Self-Talk Reframing',
    description: 'Identify one negative thought you had today and consciously rewrite it into an empowering growth perspective.',
    category: 'Mindset',
    difficulty: 'Easy',
    points: 10,
    promptDetails: 'Notice fixed mindset triggers and switch to "Yet" statements.',
    estimatedTime: '5 mins'
  },
  {
    title: 'Mindful Breathing Reset',
    description: 'Practice 3 minutes of deep box breathing (4s inhale, 4s hold, 4s exhale, 4s hold).',
    category: 'Habits',
    difficulty: 'Easy',
    points: 10,
    promptDetails: 'Reduces cortisol and improves cognitive clarity.',
    estimatedTime: '3 mins'
  }
];

const vocabularyData = [
  {
    word: 'PERSISTENT',
    pronunciation: '/pərˈsɪs.tənt/',
    meaning: 'Continuing firmly or obstinately in an opinion or course of action in spite of difficulty or opposition.',
    example: 'She was persistent in achieving her software engineering goals despite the challenges.',
    options: [
      'Giving up quickly',
      'Continuing firmly despite difficulty',
      'Being confused and indecisive',
      'Acting carelessly without focus'
    ],
    correctAnswer: 'Continuing firmly despite difficulty',
    difficulty: 'Easy',
    category: 'General'
  },
  {
    word: 'ARTICULATE',
    pronunciation: '/ɑːrˈtɪk.jə.lət/',
    meaning: 'Having or showing the ability to speak fluently and coherently.',
    example: 'He gave an articulate presentation that convinced all the stakeholders.',
    options: [
      'Speaking unclearly',
      'Having the ability to speak fluently and coherently',
      'Hesitant to voice thoughts',
      'Aggressive during discussions'
    ],
    correctAnswer: 'Having the ability to speak fluently and coherently',
    difficulty: 'Medium',
    category: 'Communication'
  },
  {
    word: 'METICULOUS',
    pronunciation: '/məˈtɪk.jə.ləs/',
    meaning: 'Showing great attention to detail; very careful and precise.',
    example: 'Her code reviews were meticulous, spotting edge cases others missed.',
    options: [
      'Hasty and prone to errors',
      'Showing great attention to detail and precision',
      'Disorganized in daily workflow',
      'Uninterested in outcomes'
    ],
    correctAnswer: 'Showing great attention to detail and precision',
    difficulty: 'Medium',
    category: 'Productivity'
  },
  {
    word: 'RESILIENT',
    pronunciation: '/rɪˈzɪl.jənt/',
    meaning: 'Able to withstand or recover quickly from difficult conditions.',
    example: 'The startup team remained resilient through product pivots and server outages.',
    options: [
      'Fragile and easily discouraged',
      'Able to recover quickly from difficulties',
      'Rigid and resistant to change',
      'Indifferent to feedback'
    ],
    correctAnswer: 'Able to recover quickly from difficulties',
    difficulty: 'Easy',
    category: 'Mindset'
  },
  {
    word: 'ELOQUENT',
    pronunciation: '/ˈel.ə.kwənt/',
    meaning: 'Fluent or persuasive in speaking or writing.',
    example: 'She delivered an eloquent keynote address on ethical technology.',
    options: [
      'Fluent and persuasive in speech or writing',
      'Awkward and stammering',
      'Overly quiet and withdrawn',
      'Technical and difficult to decipher'
    ],
    correctAnswer: 'Fluent and persuasive in speech or writing',
    difficulty: 'Medium',
    category: 'Communication'
  },
  {
    word: 'PRAGMATIC',
    pronunciation: '/præɡˈmæt.ɪk/',
    meaning: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
    example: 'We made a pragmatic choice to ship the core MVP first.',
    options: [
      'Driven by impractical ideals',
      'Practical and focused on real-world effectiveness',
      'Hesitant to make quick decisions',
      'Relying strictly on tradition'
    ],
    correctAnswer: 'Practical and focused on real-world effectiveness',
    difficulty: 'Medium',
    category: 'Productivity'
  },
  {
    word: 'CONCISENESS',
    pronunciation: '/kənˈsaɪs.nəs/',
    meaning: 'The quality of expressing much in few words; brevity and clarity.',
    example: 'Good documentation is characterized by conciseness and clear examples.',
    options: [
      'Excessive wordiness and length',
      'Expressing ideas clearly in few words',
      'Lack of relevant details',
      'Complex grammatical structure'
    ],
    correctAnswer: 'Expressing ideas clearly in few words',
    difficulty: 'Easy',
    category: 'Communication'
  },
  {
    word: 'FACILITATE',
    pronunciation: '/fəˈsɪl.ɪ.teɪt/',
    meaning: 'Make an action or process easy or easier.',
    example: 'The new dashboard helps facilitate better team communication.',
    options: [
      'Hinder or delay progress',
      'Make an action or process easier',
      'Complicate the procedures',
      'Cancel an upcoming event'
    ],
    correctAnswer: 'Make an action or process easier',
    difficulty: 'Easy',
    category: 'Business'
  },
  {
    word: 'INQUISITIVE',
    pronunciation: '/ɪnˈkwɪz.ə.tɪv/',
    meaning: 'Curious or inquiring; eager for knowledge.',
    example: 'Great software engineers maintain an inquisitive mindset about how systems work under the hood.',
    options: [
      'Indifferent to learning new topics',
      'Curious and eager for knowledge',
      'Easily distracted by noise',
      'Secretive about information'
    ],
    correctAnswer: 'Curious and eager for knowledge',
    difficulty: 'Medium',
    category: 'Mindset'
  },
  {
    word: 'DISPARATE',
    pronunciation: '/ˈdɪs.pɚ.ət/',
    meaning: 'Essentially different in kind; not allowing comparison.',
    example: 'The platform integrates disparate data sources into one unified stream.',
    options: [
      'Completely identical in structure',
      'Essentially different in kind',
      'Closely interconnected',
      'Gradually decreasing'
    ],
    correctAnswer: 'Essentially different in kind',
    difficulty: 'Hard',
    category: 'Academic'
  },
  {
    word: 'UBIQUITOUS',
    pronunciation: '/juːˈbɪk.wə.t̬əs/',
    meaning: 'Present, appearing, or found everywhere.',
    example: 'Mobile smartphones have become ubiquitous across the globe.',
    options: [
      'Extremely rare and secluded',
      'Found and appearing everywhere',
      'Obsolete and outdated',
      'Expensive to produce'
    ],
    correctAnswer: 'Found and appearing everywhere',
    difficulty: 'Hard',
    category: 'Advanced'
  },
  {
    word: 'ASSERTIVE',
    pronunciation: '/əˈsɝː.t̬ɪv/',
    meaning: 'Having or showing a confident and forceful personality while respecting others.',
    example: 'Being assertive allows you to express your needs clearly without hostility.',
    options: [
      'Timid and submissive',
      'Confident, direct, and respectful in communication',
      'Aggressive and disrespectful',
      'Quiet and unengaged'
    ],
    correctAnswer: 'Confident, direct, and respectful in communication',
    difficulty: 'Medium',
    category: 'Communication'
  },
  {
    word: 'DILIGENT',
    pronunciation: '/ˈdɪl.ə.dʒənt/',
    meaning: 'Having or showing care and conscientiousness in one’s work or duties.',
    example: 'Through diligent daily practice, he expanded his English speaking confidence.',
    options: [
      'Careless and unfocused',
      'Hard-working, careful, and conscientious',
      'Impatient with details',
      'Procrastinating constantly'
    ],
    correctAnswer: 'Hard-working, careful, and conscientious',
    difficulty: 'Easy',
    category: 'General'
  },
  {
    word: 'EXPEDITE',
    pronunciation: '/ˈek.spə.daɪt/',
    meaning: 'Make an action or process happen sooner or be accomplished more quickly.',
    example: 'Automated tests help expedite the software release cycle.',
    options: [
      'Slow down intentionally',
      'Speed up or make happen sooner',
      'Complicate the steps',
      'Postpone indefinitely'
    ],
    correctAnswer: 'Speed up or make happen sooner',
    difficulty: 'Medium',
    category: 'Business'
  },
  {
    word: 'COMPREHENSIVE',
    pronunciation: '/ˌkɑːm.prəˈhen.sɪv/',
    meaning: 'Complete; including all or nearly all elements or aspects of something.',
    example: 'The tutorial provided a comprehensive overview of React and REST APIs.',
    options: [
      'Narrow and incomplete',
      'Thorough and covering all aspects',
      'Difficult to read',
      'Theoretical only'
    ],
    correctAnswer: 'Thorough and covering all aspects',
    difficulty: 'Easy',
    category: 'General'
  },
  {
    word: 'PROACTIVE',
    pronunciation: '/proʊˈæk.tɪv/',
    meaning: 'Creating or controlling a situation by causing something to happen rather than responding after it has occurred.',
    example: 'Instead of waiting for bug reports, the team was proactive in writing unit tests.',
    options: [
      'Reacting only after issues happen',
      'Taking initiative to control and improve situations in advance',
      'Ignoring future risks',
      'Avoiding responsibility'
    ],
    correctAnswer: 'Taking initiative to control and improve situations in advance',
    difficulty: 'Easy',
    category: 'Productivity'
  },
  {
    word: 'TENACIOUS',
    pronunciation: '/təˈneɪ.ʃəs/',
    meaning: 'Tending to keep a firm hold of something; clinging or adhering closely; persistent.',
    example: 'Her tenacious attitude allowed her to master data structures despite initial hurdles.',
    options: [
      'Easily distracted and weak',
      'Persistent, determined, and stubborn in pursuing goals',
      'Casual and indifferent',
      'Cautious to a fault'
    ],
    correctAnswer: 'Persistent, determined, and stubborn in pursuing goals',
    difficulty: 'Hard',
    category: 'Mindset'
  },
  {
    word: 'COHESIVE',
    pronunciation: '/koʊˈhiː.sɪv/',
    meaning: 'Characterized by or causing cohesion; forming a united whole.',
    example: 'A good paragraph maintains a cohesive flow from sentence to sentence.',
    options: [
      'Disjointed and fragmented',
      'Forming a united and well-connected whole',
      'Overly repetitive',
      'Hard to categorize'
    ],
    correctAnswer: 'Forming a united and well-connected whole',
    difficulty: 'Medium',
    category: 'Communication'
  },
  {
    word: 'CANDID',
    pronunciation: '/ˈkæn.dɪd/',
    meaning: 'Truthful and straightforward; frank.',
    example: 'We had a candid conversation about what wasn’t working in the sprint.',
    options: [
      'Deceptive and vague',
      'Truthful, frank, and straightforward',
      'Uncertain and hesitant',
      'Flattering and insincere'
    ],
    correctAnswer: 'Truthful, frank, and straightforward',
    difficulty: 'Medium',
    category: 'Communication'
  },
  {
    word: 'PARADIGM',
    pronunciation: '/ˈper.ə.daɪm/',
    meaning: 'A typical example or pattern of something; a model or worldview.',
    example: 'Component-based architecture represents a fundamental paradigm shift in web development.',
    options: [
      'A temporary fad',
      'A distinct model, pattern, or framework of thought',
      'An unexpected software glitch',
      'A simple calculation'
    ],
    correctAnswer: 'A distinct model, pattern, or framework of thought',
    difficulty: 'Hard',
    category: 'Academic'
  }
];

const grammarData = [
  {
    question: 'Choose the sentence with the correct subject-verb agreement:',
    options: [
      'He go to college every day.',
      'He goes to college every day.',
      'He going to college every day.',
      'He gone to college every day.'
    ],
    correctAnswer: 'He goes to college every day.',
    explanation: 'With third-person singular subjects (he, she, it), the present simple tense requires adding -s or -es to the verb base.',
    difficulty: 'Easy',
    category: 'Subject-Verb Agreement'
  },
  {
    question: 'Select the sentence that correctly uses a conditional tense:',
    options: [
      'If I will study hard, I would pass.',
      'If I study hard, I will pass the exam.',
      'If I studied hard, I will passed.',
      'If I had studied hard, I pass.'
    ],
    correctAnswer: 'If I study hard, I will pass the exam.',
    explanation: 'In the first conditional (real possibility), the "if" clause uses simple present, and the main clause uses "will + base verb".',
    difficulty: 'Medium',
    category: 'Conditionals'
  },
  {
    question: 'Identify the sentence with the correct preposition:',
    options: [
      'She is good in speaking English.',
      'She is good at speaking English.',
      'She is good for speaking English.',
      'She is good with speaking English.'
    ],
    correctAnswer: 'She is good at speaking English.',
    explanation: 'When expressing skill or proficiency in an activity, we use the adjective phrase "good at [noun/gerund]".',
    difficulty: 'Easy',
    category: 'Prepositions'
  },
  {
    question: 'Which sentence correctly avoids a double negative?',
    options: [
      'I don’t know nothing about the bug.',
      'I don’t know anything about the bug.',
      'I can’t find no errors in the code.',
      'She didn’t see nobody at the desk.'
    ],
    correctAnswer: 'I don’t know anything about the bug.',
    explanation: 'Standard English uses "anything" or "anybody" with negative verbs ("don\'t know") to avoid contradictory double negatives.',
    difficulty: 'Easy',
    category: 'Negation'
  },
  {
    question: 'Choose the sentence that correctly uses "fewer" vs "less":',
    options: [
      'There were less errors in the second sprint.',
      'There were fewer errors in the second sprint.',
      'He drank fewer water during the run.',
      'She made less mistakes on the test.'
    ],
    correctAnswer: 'There were fewer errors in the second sprint.',
    explanation: 'Use "fewer" with countable plural nouns (errors, mistakes, people) and "less" with uncountable bulk nouns (water, time, money).',
    difficulty: 'Medium',
    category: 'Modifiers'
  },
  {
    question: 'Choose the correct sentence in the past perfect tense:',
    options: [
      'By the time the meeting started, they already finished the slide deck.',
      'By the time the meeting started, they had already finished the slide deck.',
      'By the time the meeting started, they have already finished the slide deck.',
      'By the time the meeting was starting, they finish the slide deck.'
    ],
    correctAnswer: 'By the time the meeting started, they had already finished the slide deck.',
    explanation: 'Past perfect ("had + past participle") describes an action completed before another past event occurred.',
    difficulty: 'Medium',
    category: 'Tenses'
  },
  {
    question: 'Select the grammatically correct sentence with a dangling modifier fixed:',
    options: [
      'Walking down the street, the trees looked beautiful.',
      'Walking down the street, I admired the beautiful trees.',
      'Walking down the street, my phone rang loudly.',
      'Walking down the street, the rain began to pour.'
    ],
    correctAnswer: 'Walking down the street, I admired the beautiful trees.',
    explanation: 'The introductory participle clause "Walking down the street" must logically modify the subject that follows ("I"), not "the trees" or "my phone".',
    difficulty: 'Hard',
    category: 'Modifiers'
  },
  {
    question: 'Choose the sentence with correct pronoun case:',
    options: [
      'Between you and I, this project is exciting.',
      'Between you and me, this project is exciting.',
      'Between you and myself, this project is exciting.',
      'Between yourself and me, this project is exciting.'
    ],
    correctAnswer: 'Between you and me, this project is exciting.',
    explanation: '"Between" is a preposition, so pronouns following it must be in the objective case ("me", not "I").',
    difficulty: 'Medium',
    category: 'Pronouns'
  },
  {
    question: 'Select the sentence that correctly uses the subjunctive mood:',
    options: [
      'I suggest that he goes to the doctor.',
      'I suggest that he go to the doctor.',
      'I suggest that he went to the doctor.',
      'I suggest that he will go to the doctor.'
    ],
    correctAnswer: 'I suggest that he go to the doctor.',
    explanation: 'Verbs of suggestion, recommendation, or demand (suggest, insist, recommend) take the subjunctive base form ("go", not "goes").',
    difficulty: 'Hard',
    category: 'Subjunctive'
  },
  {
    question: 'Choose the sentence with proper parallel structure:',
    options: [
      'She enjoys coding, to write blog posts, and designing interfaces.',
      'She enjoys coding, writing blog posts, and designing interfaces.',
      'She enjoys to code, writing blog posts, and design.',
      'She enjoys coding, write blog posts, and design interfaces.'
    ],
    correctAnswer: 'She enjoys coding, writing blog posts, and designing interfaces.',
    explanation: 'Parallel structure requires all items in a series to share the same grammatical form (all gerunds: coding, writing, designing).',
    difficulty: 'Medium',
    category: 'Parallelism'
  },
  {
    question: 'Identify the correct use of "affect" vs "effect":',
    options: [
      'The changes will not effect our deployment schedule.',
      'The changes will not affect our deployment schedule.',
      'Lack of sleep has a negative affect on focus.',
      'Good habits will produce positive affects.'
    ],
    correctAnswer: 'The changes will not affect our deployment schedule.',
    explanation: '"Affect" is typically a verb meaning to influence; "effect" is typically a noun meaning the result or outcome.',
    difficulty: 'Medium',
    category: 'Confusing Words'
  },
  {
    question: 'Select the sentence with proper punctuation for a compound sentence:',
    options: [
      'I wanted to practice speaking, however I ran out of time.',
      'I wanted to practice speaking; however, I ran out of time.',
      'I wanted to practice speaking however, I ran out of time.',
      'I wanted to practice speaking, however; I ran out of time.'
    ],
    correctAnswer: 'I wanted to practice speaking; however, I ran out of time.',
    explanation: 'When joining two independent clauses with a conjunctive adverb like "however", use a semicolon before and a comma after.',
    difficulty: 'Hard',
    category: 'Punctuation'
  },
  {
    question: 'Which of the following uses the correct passive voice construction?',
    options: [
      'The bug was fix by the engineering team.',
      'The bug was fixed by the engineering team.',
      'The bug fixed by the engineering team.',
      'The bug has fixing by the engineering team.'
    ],
    correctAnswer: 'The bug was fixed by the engineering team.',
    explanation: 'Passive voice in simple past requires "was/were + past participle" ("was fixed").',
    difficulty: 'Easy',
    category: 'Passive Voice'
  },
  {
    question: 'Select the correct sentence with "neither... nor":',
    options: [
      'Neither the manager nor the developers is available.',
      'Neither the manager nor the developers are available.',
      'Neither the manager or the developers are available.',
      'Neither the manager nor the developers was available.'
    ],
    correctAnswer: 'Neither the manager nor the developers are available.',
    explanation: 'With "neither... nor", the verb agrees with the subject closest to it ("developers" is plural, so use "are").',
    difficulty: 'Medium',
    category: 'Subject-Verb Agreement'
  },
  {
    question: 'Choose the correct form of the adjective for comparison:',
    options: [
      'This algorithm is more faster than the previous one.',
      'This algorithm is faster than the previous one.',
      'This algorithm is fastest than the previous one.',
      'This algorithm is most fast than the previous one.'
    ],
    correctAnswer: 'This algorithm is faster than the previous one.',
    explanation: 'One-syllable adjectives form comparatives by adding -er ("faster"). Never use "more" together with -er.',
    difficulty: 'Easy',
    category: 'Adjectives'
  },
  {
    question: 'Identify the sentence that correctly uses an apostrophe for possession:',
    options: [
      'Its important to review the users permissions.',
      'It’s important to review the user’s permissions.',
      'Its important to review the user’s permissions.',
      'It’s important to review the users’s permissions.'
    ],
    correctAnswer: 'It’s important to review the user’s permissions.',
    explanation: '"It’s" is the contraction for "It is", and "user’s permissions" denotes possession belonging to the user.',
    difficulty: 'Easy',
    category: 'Punctuation'
  },
  {
    question: 'Select the sentence with the correct indirect question structure:',
    options: [
      'Could you tell me where is the conference room?',
      'Could you tell me where the conference room is?',
      'Could you tell me where does the conference room be?',
      'Could you tell me where is located the conference room?'
    ],
    correctAnswer: 'Could you tell me where the conference room is?',
    explanation: 'In embedded/indirect questions, word order returns to statement order: subject + verb ("where the conference room is").',
    difficulty: 'Hard',
    category: 'Word Order'
  },
  {
    question: 'Choose the sentence with correct verb form after "look forward to":',
    options: [
      'I look forward to meet you at the summit.',
      'I look forward to meeting you at the summit.',
      'I look forward to met you at the summit.',
      'I am looking forward to meet you at the summit.'
    ],
    correctAnswer: 'I look forward to meeting you at the summit.',
    explanation: 'In "look forward to", "to" functions as a preposition, which must be followed by a noun or gerund ("meeting").',
    difficulty: 'Medium',
    category: 'Gerunds & Infinitives'
  },
  {
    question: 'Which sentence correctly uses "since" vs "for":',
    options: [
      'I have been practicing speaking since three years.',
      'I have been practicing speaking for three years.',
      'I have been practicing speaking for 2021.',
      'I have practiced speaking since three hours.'
    ],
    correctAnswer: 'I have been practicing speaking for three years.',
    explanation: '"For" is used with durations/periods of time ("for three years"), while "since" is used with starting points in time ("since 2021").',
    difficulty: 'Easy',
    category: 'Tenses'
  },
  {
    question: 'Choose the sentence with proper use of "who" vs "whom":',
    options: [
      'The engineer whom designed the architecture won an award.',
      'The engineer who designed the architecture won an award.',
      'Whom wrote this pull request?',
      'The candidate who I interviewed yesterday was very articulate.'
    ],
    correctAnswer: 'The engineer who designed the architecture won an award.',
    explanation: '"Who" functions as the grammatical subject of the relative clause ("who designed...").',
    difficulty: 'Hard',
    category: 'Relative Pronouns'
  }
];

const achievementsData = [
  {
    title: 'First Streak',
    description: 'Complete daily activities for 3 consecutive days.',
    requirementType: 'streak',
    requirementThreshold: 3,
    icon: 'flame',
    xpReward: 50
  },
  {
    title: 'Week Warrior',
    description: 'Maintain an unbroken 7-day consistency streak.',
    requirementType: 'streak',
    requirementThreshold: 7,
    icon: 'zap',
    xpReward: 100
  },
  {
    title: 'Fortnight Champion',
    description: 'Crush 14 consecutive days of self-improvement.',
    requirementType: 'streak',
    requirementThreshold: 14,
    icon: 'shield-check',
    xpReward: 200
  },
  {
    title: 'XP Hunter',
    description: 'Accumulate a milestone of 500 total XP.',
    requirementType: 'xp',
    requirementThreshold: 500,
    icon: 'star',
    xpReward: 75
  },
  {
    title: 'XP Grandmaster',
    description: 'Surpass 1,500 total XP on LevelUp.',
    requirementType: 'xp',
    requirementThreshold: 1500,
    icon: 'award',
    xpReward: 150
  },
  {
    title: 'Confident Speaker',
    description: 'Complete 5 one-minute speaking challenges.',
    requirementType: 'speaking',
    requirementThreshold: 5,
    icon: 'mic',
    xpReward: 60
  },
  {
    title: 'Word Builder',
    description: 'Learn and quiz yourself on 10 vocabulary words.',
    requirementType: 'vocabulary',
    requirementThreshold: 10,
    icon: 'book-open',
    xpReward: 60
  },
  {
    title: 'Grammar Master',
    description: 'Solve 10 grammar challenges accurately.',
    requirementType: 'grammar',
    requirementThreshold: 10,
    icon: 'edit-3',
    xpReward: 60
  },
  {
    title: 'Productivity Pro',
    description: 'Complete 10 daily planner tasks.',
    requirementType: 'tasks',
    requirementThreshold: 10,
    icon: 'check-circle-2',
    xpReward: 50
  },
  {
    title: 'Habit Anchor',
    description: 'Reach a 7-day streak on any individual habit.',
    requirementType: 'habits',
    requirementThreshold: 7,
    icon: 'heart',
    xpReward: 80
  },
  {
    title: 'Consistent Legend',
    description: 'Complete 30 total growth activities on LevelUp.',
    requirementType: 'totalActivities',
    requirementThreshold: 30,
    icon: 'trophy',
    xpReward: 250
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      Challenge.deleteMany({}),
      Vocabulary.deleteMany({}),
      Grammar.deleteMany({}),
      Achievement.deleteMany({})
    ]);

    console.log('[Seed] Seeding Challenges...');
    await Challenge.insertMany([...speakingChallenges, ...generalChallenges]);
    console.log(`[Seed] Seeded ${speakingChallenges.length + generalChallenges.length} challenges.`);

    console.log('[Seed] Seeding Vocabulary...');
    await Vocabulary.insertMany(vocabularyData);
    console.log(`[Seed] Seeded ${vocabularyData.length} vocabulary words.`);

    console.log('[Seed] Seeding Grammar...');
    await Grammar.insertMany(grammarData);
    console.log(`[Seed] Seeded ${grammarData.length} grammar exercises.`);

    console.log('[Seed] Seeding Achievements...');
    const insertedAchievements = await Achievement.insertMany(achievementsData);
    console.log(`[Seed] Seeded ${insertedAchievements.length} achievements.`);

    // Seed Demo User if not exists
    const demoEmail = 'demo@levelup.com';
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      console.log('[Seed] Creating demo user account...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Password123!', salt);

      // Create realistic demo user with 7-day streak and 450 XP (Explorer level)
      const today = new Date().toISOString().split('T')[0];
      demoUser = await User.create({
        name: 'Alex Mercer',
        email: demoEmail,
        password: hashedPassword,
        totalPoints: 450,
        level: 'Explorer',
        currentStreak: 7,
        longestStreak: 14,
        lastActivityDate: today,
        avatar: 'trophy',
        bio: 'Aspiring software engineer focusing on English fluency, daily habits, and consistent code sprints.'
      });

      // Unlock initial achievements for demo user
      const firstStreakAch = insertedAchievements.find(a => a.requirementType === 'streak' && a.requirementThreshold === 3);
      const weekWarriorAch = insertedAchievements.find(a => a.requirementType === 'streak' && a.requirementThreshold === 7);

      if (firstStreakAch) {
        await UserAchievement.create({
          userId: demoUser._id,
          achievementId: firstStreakAch._id,
          unlockedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        });
      }
      if (weekWarriorAch) {
        await UserAchievement.create({
          userId: demoUser._id,
          achievementId: weekWarriorAch._id,
          unlockedAt: new Date()
        });
      }

      // Seed sample tasks
      await Task.insertMany([
        {
          userId: demoUser._id,
          title: 'Complete DSA Binary Search Problem Set',
          description: 'Solve 3 medium LeetCode questions focusing on search space boundaries.',
          priority: 'High',
          completed: true,
          date: today
        },
        {
          userId: demoUser._id,
          title: 'Practice 1-Minute English Speaking Prompt',
          description: 'Record and evaluate speech pacing and transition phrases.',
          priority: 'Medium',
          completed: true,
          date: today
        },
        {
          userId: demoUser._id,
          title: 'Complete Web Technology Full-Stack Assignment',
          description: 'Build backend controllers, Mongoose schemas, and verify endpoints.',
          priority: 'High',
          completed: false,
          date: today
        },
        {
          userId: demoUser._id,
          title: 'Read 15 Pages of "Atomic Habits"',
          description: 'Take notes on habit stacking and cue design.',
          priority: 'Low',
          completed: false,
          date: today
        }
      ]);

      // Seed sample habits
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
      }

      await Habit.insertMany([
        {
          userId: demoUser._id,
          name: 'Daily Coding Sprint',
          description: 'Write at least 30 minutes of clean, focused code.',
          category: 'Productivity',
          completedDates: last7Days,
          currentStreak: 7,
          longestStreak: 12
        },
        {
          userId: demoUser._id,
          name: 'English Speaking Practice',
          description: 'Speak aloud for 5-10 minutes on a technical or daily topic.',
          category: 'English',
          completedDates: last7Days.slice(1), // missed 6 days ago
          currentStreak: 6,
          longestStreak: 9
        },
        {
          userId: demoUser._id,
          name: 'Morning Workout & Stretch',
          description: '20 minutes of cardio or resistance exercise.',
          category: 'Health',
          completedDates: [last7Days[1], last7Days[2], last7Days[4], last7Days[6]],
          currentStreak: 1,
          longestStreak: 5
        },
        {
          userId: demoUser._id,
          name: 'Read Non-Fiction Book',
          description: '10 pages of psychology, tech, or personal finance.',
          category: 'Learning',
          completedDates: last7Days.slice(2),
          currentStreak: 5,
          longestStreak: 7
        }
      ]);

      // Seed sample past progress records to populate charts realistically
      const progressEntries = [];
      const pastCategories = ['Speaking', 'Vocabulary', 'Grammar', 'Productivity', 'Habits'];
      for (let i = 6; i >= 0; i--) {
        const dateStr = last7Days[6 - i];
        const count = 2 + (i % 3);
        for (let j = 0; j < count; j++) {
          const cat = pastCategories[(i + j) % pastCategories.length];
          progressEntries.push({
            userId: demoUser._id,
            category: cat,
            title: `${cat} Activity Session`,
            pointsEarned: cat === 'Speaking' ? 20 : 10,
            date: dateStr,
            completedAt: new Date(new Date(dateStr).getTime() + (j * 3600000))
          });
        }
      }
      await Progress.insertMany(progressEntries);

      // Seed sample thought of the day
      await Thought.create({
        userId: demoUser._id,
        question: 'What is one thing you want to improve today?',
        answer: 'I want to speak with clearer articulation without rushing, and structure my answers with the STAR method.',
        date: today
      });

      console.log('[Seed] Demo user and realistic history seeded successfully!');
      console.log('----------------------------------------------------');
      console.log('DEMO CREDENTIALS:');
      console.log('Email:    demo@levelup.com');
      console.log('Password: Password123!');
      console.log('----------------------------------------------------');
    } else {
      console.log('[Seed] Demo user already exists.');
    }

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();
