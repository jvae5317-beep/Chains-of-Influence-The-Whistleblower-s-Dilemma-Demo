import { Scene } from '@/types/game';
import { NPCS } from './npcs';

export const SCENES: Record<string, Scene> = {
  // === ACT 1: THE APPROACH ===
  intro: {
    id: 'intro',
    title: 'The Weight of Silence',
    location: 'Your Office - Late Evening',
    ambiance: 'tense',
    narrative: [
      'The manila envelope sits on your desk like an accusation.',
      'Outside, the city hums with its usual evening chaos—jeepneys honking, vendors calling out, the distant bass of a karaoke bar. Inside, the only sound is the ceiling fan cutting lazy circles through humid air.',
      'You\'ve been a political consultant for fifteen years. Long enough to know when something is about to change everything. Long enough to recognize the particular weight of documents that someone died to deliver.',
      'Maria Santos left it with your secretary three hours ago. The journalist. The one they call "The Bloodhound" in the corridors of power. She said she\'d be back at midnight.',
      'It\'s 11:47 PM.',
    ],
    choices: [
      {
        id: 'open_envelope',
        text: 'Open the envelope',
        effects: [
          { type: 'flag', target: 'read_initial_documents', value: true },
          { type: 'resource', target: 'exposure', value: 5 },
        ],
        nextScene: 'first_look',
        flavorText: 'Knowledge is power. And danger.',
      },
      {
        id: 'wait_for_maria',
        text: 'Leave it sealed. Wait for her.',
        effects: [
          { type: 'flag', target: 'waited_for_maria', value: true },
        ],
        nextScene: 'maria_arrives_sealed',
        flavorText: 'Plausible deniability has its uses.',
      },
    ],
  },

  first_look: {
    id: 'first_look',
    title: 'The Evidence',
    location: 'Your Office',
    ambiance: 'dark',
    narrative: [
      'Your hands are steady as you break the seal. A professional habit—never let them see you sweat.',
      'Inside: Photocopies of bank records. A government memo with familiar signatures. Photographs of coastal land, before and after. And names. So many names.',
      'Governor Eduardo Reyes. The Bloodline heir who has ruled this province like a personal fiefdom for two decades. His signature is everywhere.',
      'Director Ramon Mendoza. The bureaucrat who stamps the papers that make the impossible legal.',
      'And at the bottom of the pile, a handwritten note: "340 families displaced. One dead. More to come unless this gets out."',
    ],
    documents: ['land_memo', 'bank_records'],
    choices: [
      {
        id: 'review_details',
        text: 'Study the documents carefully',
        effects: [
          { type: 'flag', target: 'thoroughly_reviewed', value: true },
          { type: 'resource', target: 'influence', value: 5 },
        ],
        nextScene: 'deep_review',
        flavorText: 'The devil is in the details.',
      },
      {
        id: 'put_away',
        text: 'Put them away before Maria arrives',
        effects: [],
        nextScene: 'maria_arrives_read',
        flavorText: 'You\'ve seen enough.',
      },
    ],
  },

  deep_review: {
    id: 'deep_review',
    title: 'Connecting the Dots',
    location: 'Your Office',
    ambiance: 'tense',
    narrative: [
      'You spread the documents across your desk, arranging them like pieces of a puzzle you wish you couldn\'t solve.',
      'The offshore accounts route through Singapore, Hong Kong, then the Caymans. Professional work. The kind that costs money to set up and more money to hide.',
      'The land reclassification happened in record time—two weeks instead of the usual six months. Someone greased every wheel.',
      'And the families... you recognize some of the names on the displacement list. Fishermen. Farmers. People whose families have worked that coastal land for generations.',
      'A knock at the door. Three sharp raps.',
    ],
    documents: ['displaced_families'],
    choices: [
      {
        id: 'answer_door',
        text: '"Come in."',
        effects: [],
        nextScene: 'maria_meeting',
      },
    ],
  },

  maria_arrives_sealed: {
    id: 'maria_arrives_sealed',
    title: 'The Journalist',
    location: 'Your Office',
    ambiance: 'tense',
    speaker: NPCS.maria_santos,
    narrative: [
      'The door opens at exactly midnight. Maria Santos has always been punctual.',
      'She\'s smaller than her reputation—slight frame, tired eyes behind wire-rimmed glasses. But there\'s steel in the way she carries herself.',
      'Her gaze falls on the unopened envelope.',
    ],
    dialogue: [
      '"You didn\'t read it."',
      'It\'s not a question.',
      '"Wise or cowardly. I haven\'t decided which."',
    ],
    choices: [
      {
        id: 'wise',
        text: '"Wise. What I don\'t know can\'t be tortured out of me."',
        effects: [
          { type: 'faction', target: 'reformists', value: 5 },
        ],
        nextScene: 'maria_explains',
        flavorText: 'Dark humor. She might appreciate it.',
      },
      {
        id: 'cautious',
        text: '"Professional. I prefer to hear context first."',
        effects: [
          { type: 'resource', target: 'influence', value: 5 },
        ],
        nextScene: 'maria_explains',
        flavorText: 'Maintain control of the conversation.',
      },
    ],
  },

  maria_arrives_read: {
    id: 'maria_arrives_read',
    title: 'The Journalist',
    location: 'Your Office',
    ambiance: 'tense',
    speaker: NPCS.maria_santos,
    narrative: [
      'The door opens at exactly midnight. Maria Santos has always been punctual.',
      'She\'s smaller than her reputation—slight frame, tired eyes behind wire-rimmed glasses. But there\'s steel in the way she carries herself.',
      'Her gaze falls on the opened envelope, the documents hastily stacked.',
    ],
    dialogue: [
      '"You read them."',
      'It\'s not a question.',
      '"Good. Then you know what\'s at stake."',
    ],
    choices: [
      {
        id: 'continue',
        text: '"I know what Governor Reyes is capable of. Tell me what you need."',
        effects: [],
        nextScene: 'maria_explains',
      },
    ],
  },

  maria_meeting: {
    id: 'maria_meeting',
    title: 'The Journalist',
    location: 'Your Office',
    ambiance: 'tense',
    speaker: NPCS.maria_santos,
    narrative: [
      'Maria Santos slips through the door like she\'s used to not being seen.',
      'Her eyes take in the documents spread across your desk. A ghost of a smile.',
    ],
    dialogue: [
      '"You\'ve done your homework. Good."',
      'She sits without being invited, pulling out a worn notebook.',
      '"I don\'t have much time. They\'re watching me. So I\'ll be direct."',
    ],
    choices: [
      {
        id: 'continue',
        text: '"I\'m listening."',
        effects: [],
        nextScene: 'maria_explains',
      },
    ],
  },

  maria_explains: {
    id: 'maria_explains',
    title: 'The Story',
    location: 'Your Office',
    ambiance: 'urgent',
    speaker: NPCS.maria_santos,
    narrative: [
      'Maria leans forward, voice dropping.',
    ],
    dialogue: [
      '"Reyes and Mendoza have been running a land grab operation for three years. Agricultural land reclassified as commercial. Families displaced with pocket change or nothing at all. The coastal development alone has displaced over three hundred families."',
      'She pauses.',
      '"One man—Mang Tonyo, a fisherman—refused to leave. They said it was a heart attack. His family says otherwise."',
      '"I have everything I need to publish. Bank records, government memos, testimonies. But the moment this goes to print, I\'m dead. My sources are dead. Everyone who helped me is dead."',
      '"I need someone who can navigate this world. Someone with connections to all sides. Someone who can help me survive long enough to tell this story."',
      'Her eyes meet yours.',
      '"I need you."',
    ],
    documents: ['threat_note'],
    choices: [
      {
        id: 'why_me',
        text: '"Why me? I\'ve worked with people like Reyes before."',
        effects: [],
        nextScene: 'why_you',
        flavorText: 'A fair question.',
      },
      {
        id: 'whats_in_it',
        text: '"What\'s in it for me?"',
        effects: [
          { type: 'faction', target: 'reformists', value: -5 },
          { type: 'resource', target: 'influence', value: 5 },
        ],
        nextScene: 'whats_in_it',
        flavorText: 'Everyone has their price.',
      },
      {
        id: 'im_in',
        text: '"Tell me what you need."',
        effects: [
          { type: 'faction', target: 'reformists', value: 10 },
          { type: 'flag', target: 'committed_early', value: true },
        ],
        nextScene: 'the_plan',
        flavorText: 'Sometimes you just know.',
      },
    ],
  },

  why_you: {
    id: 'why_you',
    title: 'The Reason',
    location: 'Your Office',
    ambiance: 'calm',
    speaker: NPCS.maria_santos,
    narrative: [
      'Maria studies you for a long moment.',
    ],
    dialogue: [
      '"Because you\'ve worked with everyone and belong to no one."',
      '"The Administrators trust your discretion. The Bloodlines respect your results. The Fixers think you\'re one of them. And my people... the Reformists... we\'ve watched you."',
      'She tilts her head.',
      '"You\'ve never crossed a line you couldn\'t live with. That\'s rare in this city."',
      '"Besides, if I\'m wrong about you, I\'m already dead anyway."',
    ],
    choices: [
      {
        id: 'fair_point',
        text: '"Fair point. What do you need?"',
        effects: [],
        nextScene: 'the_plan',
      },
      {
        id: 'still_thinking',
        text: '"I need time to think about this."',
        effects: [],
        nextScene: 'pressure_point',
      },
    ],
  },

  whats_in_it: {
    id: 'whats_in_it',
    title: 'The Price',
    location: 'Your Office',
    ambiance: 'tense',
    speaker: NPCS.maria_santos,
    narrative: [
      'Maria\'s expression hardens.',
    ],
    dialogue: [
      '"Three hundred and forty families lost everything. One man is dead. And you want to negotiate payment?"',
      'A long pause.',
      '"Fine. Here\'s what\'s in it for you: When this story breaks, everyone connected to Reyes goes down. Everyone. Including the consultants who helped him. Including you."',
      '"Your name is on some of those documents. Not the dirty parts—not yet. But if Reyes falls and you\'re not on the right side..."',
      'She lets the implication hang.',
      '"Help me, and I bury those connections. Oppose me, and I include them in the story. Your choice."',
    ],
    choices: [
      {
        id: 'impressed',
        text: '"I respect someone who plays hardball. Tell me the plan."',
        effects: [
          { type: 'faction', target: 'reformists', value: 5 },
        ],
        nextScene: 'the_plan',
      },
      {
        id: 'threatened',
        text: '"You\'re threatening me?"',
        effects: [
          { type: 'flag', target: 'antagonized_maria', value: true },
        ],
        nextScene: 'maria_threatens',
      },
    ],
  },

  maria_threatens: {
    narrative: [],
    id: 'maria_threatens',
    title: 'Lines Drawn',
    location: 'Your Office',
    ambiance: 'dark',
    speaker: NPCS.maria_santos,
    dialogue: [
      '"I\'m telling you how things are. The difference between threats and reality is something you should understand by now."',
      '"I didn\'t come here to beg. I came because you\'re useful. If you\'re not..."',
      'She stands.',
      '"Then we\'re both on our own."',
    ],
    choices: [
      {
        id: 'wait',
        text: '"Sit down. Let\'s talk about this properly."',
        effects: [
          { type: 'faction', target: 'reformists', value: 5 },
        ],
        nextScene: 'the_plan',
      },
      {
        id: 'let_her_leave',
        text: 'Let her leave.',
        effects: [
          { type: 'flag', target: 'refused_maria', value: true },
        ],
        nextScene: 'alone_again',
      },
    ],
  },

  alone_again: {
    id: 'alone_again',
    title: 'The Choice Unmade',
    location: 'Your Office',
    ambiance: 'dark',
    narrative: [
      'The door closes. The room feels emptier.',
      'The documents still sit on your desk. The story is still there. The dead man is still dead.',
      'You could burn everything. Pretend this night never happened. Go back to the careful dance of neutrality that has kept you alive.',
      'Or...',
      'Your phone buzzes. A text from an unknown number:',
      '"We should talk about the journalist. - V.C."',
      'Atty. Cruz. The Fixer. Of course he knows.',
      'In this city, nothing stays secret for long.',
    ],
    choices: [
      {
        id: 'meet_cruz',
        text: 'Meet with Cruz',
        effects: [
          { type: 'faction', target: 'fixers', value: 10 },
          { type: 'resource', target: 'exposure', value: 10 },
        ],
        nextScene: 'cruz_meeting',
      },
      {
        id: 'call_maria',
        text: 'Call Maria back',
        effects: [
          { type: 'faction', target: 'reformists', value: 10 },
        ],
        nextScene: 'call_maria_back',
      },
      {
        id: 'burn_evidence',
        text: 'Burn the documents and ignore everyone',
        effects: [
          { type: 'resource', target: 'morality', value: -20 },
          { type: 'flag', target: 'burned_evidence', value: true },
        ],
        nextScene: 'ending_cycle',
      },
    ],
  },

  pressure_point: {
    id: 'pressure_point',
    title: 'No Time',
    location: 'Your Office',
    ambiance: 'urgent',
    speaker: NPCS.maria_santos,
    narrative: [
      'Urgency flashes across Maria\'s face.',
    ],
    dialogue: [
      '"Time is the one thing I don\'t have."',
      '"They know I\'m close to publishing. I\'ve already received threats."',
      'She pulls out her phone, shows you a message.',
      '"\'Some stories are better left untold. You have family. Think about them.\'"',
      '"My editor is getting cold feet. My sources are going silent. If I wait much longer, there won\'t be a story—just a missing journalist that no one remembers."',
    ],
    documents: ['threat_note'],
    choices: [
      {
        id: 'understand',
        text: '"I understand. Tell me your plan."',
        effects: [],
        nextScene: 'the_plan',
      },
      {
        id: 'too_dangerous',
        text: '"This is too dangerous. I can\'t help you."',
        effects: [
          { type: 'flag', target: 'refused_maria', value: true },
        ],
        nextScene: 'alone_again',
      },
    ],
  },

  the_plan: {
    id: 'the_plan',
    title: 'The Strategy',
    location: 'Your Office',
    ambiance: 'calm',
    speaker: NPCS.maria_santos,
    narrative: [
      'Maria nods, some of the tension leaving her shoulders.',
    ],
    dialogue: [
      '"Here\'s what I need:"',
      '"First, I need protection for my sources. Some of them are inside Mendoza\'s bureau. If they\'re exposed before publication, they\'re finished."',
      '"Second, I need to get this story to an outlet that Reyes can\'t pressure. Local papers are too scared. I need to go international, but I need an introduction."',
      '"Third... I need leverage. Something that makes them hesitate before coming after me. A dead man\'s switch. Something that means killing me makes things worse, not better."',
      'She looks at you.',
      '"You know people on all sides. You know how these games are played. I need you to help me play it."',
    ],
    choices: [
      {
        id: 'go_public',
        text: '"We go public. Loud and fast. Make it impossible to silence."',
        effects: [
          { type: 'faction', target: 'reformists', value: 15 },
          { type: 'faction', target: 'bloodlines', value: -10 },
          { type: 'resource', target: 'exposure', value: 25 },
          { type: 'flag', target: 'chose_public', value: true },
        ],
        nextScene: 'public_path',
        flavorText: 'The dangerous path. But maybe the right one.',
      },
      {
        id: 'work_shadows',
        text: '"We work the shadows. Quietly build pressure until they have to negotiate."',
        effects: [
          { type: 'faction', target: 'fixers', value: 10 },
          { type: 'resource', target: 'influence', value: 15 },
          { type: 'flag', target: 'chose_shadow', value: true },
        ],
        nextScene: 'shadow_path',
        flavorText: 'The careful path. More control, more compromise.',
      },
      {
        id: 'need_more_info',
        text: '"Before I commit, I need to know who else is involved."',
        effects: [],
        nextScene: 'more_info',
        flavorText: 'Knowledge before action.',
      },
    ],
  },

  call_maria_back: {
    id: 'call_maria_back',
    title: 'Second Chances',
    location: 'Your Office',
    ambiance: 'hopeful',
    narrative: [
      'The phone rings twice before she answers.',
    ],
    speaker: NPCS.maria_santos,
    dialogue: [
      '"Changed your mind?"',
      'Her voice is flat, but there\'s a thread of hope in it.',
      '"I\'m still at the corner of Ayala. I can be back in five minutes."',
    ],
    choices: [
      {
        id: 'come_back',
        text: '"Come back. Let\'s talk about your plan."',
        effects: [
          { type: 'faction', target: 'reformists', value: 5 },
        ],
        nextScene: 'the_plan',
      },
    ],
  },

  more_info: {
    id: 'more_info',
    title: 'The Players',
    narrative: [
      'Maria settles into her chair, preparing to lay out the battlefield.',
    ],
    location: 'Your Office',
    ambiance: 'calm',
    speaker: NPCS.maria_santos,
    dialogue: [
      '"Fair enough."',
      '"Governor Reyes is the face, but he\'s not alone. Director Mendoza handles the paperwork—without him, nothing moves through the bureaucracy. They\'ve been partners for at least a decade."',
      '"Then there\'s Atty. Cruz. The Fixer. He brokers between everyone—politicians, businessmen, sometimes worse. He\'ll already know we met tonight."',
      '"My sources tell me Cruz has been approached about... making this problem go away. He hasn\'t taken the job yet. But he\'s considering it."',
      '"And then there\'s my side. The Reformists. Journalists, activists, a few honest lawyers. We don\'t have money or power, but we have truth. For what that\'s worth."',
    ],
    choices: [
      {
        id: 'go_public_now',
        text: '"We go public. Force their hand."',
        effects: [
          { type: 'faction', target: 'reformists', value: 15 },
          { type: 'faction', target: 'bloodlines', value: -10 },
          { type: 'resource', target: 'exposure', value: 25 },
          { type: 'flag', target: 'chose_public', value: true },
        ],
        nextScene: 'public_path',
      },
      {
        id: 'shadow_approach',
        text: '"We work quietly. Build leverage first."',
        effects: [
          { type: 'faction', target: 'fixers', value: 10 },
          { type: 'resource', target: 'influence', value: 15 },
          { type: 'flag', target: 'chose_shadow', value: true },
        ],
        nextScene: 'shadow_path',
      },
      {
        id: 'talk_to_cruz_first',
        text: '"Let me talk to Cruz first. Feel out the situation."',
        effects: [
          { type: 'faction', target: 'fixers', value: 15 },
          { type: 'faction', target: 'reformists', value: -5 },
          { type: 'flag', target: 'chose_cruz', value: true },
        ],
        nextScene: 'cruz_path',
        flavorText: 'Playing both sides. Dangerous.',
      },
    ],
  },

  // === BRANCHING PATHS ===

  public_path: {
    id: 'public_path',
    title: 'Into the Light',
    location: 'Your Office',
    ambiance: 'urgent',
    speaker: NPCS.maria_santos,
    narrative: [
      'A dangerous light enters Maria\'s eyes.',
    ],
    dialogue: [
      '"You\'re serious."',
      '"This means going to war with the Bloodlines. With the entire establishment. Once we start, there\'s no going back."',
      'She pulls out her phone.',
      '"I have a contact at the International Consortium of Journalists. They\'ve been interested in Philippine corruption stories. If we can get them the documents, get witness statements on record..."',
      '"It\'ll be loud. It\'ll be ugly. And we\'ll both have targets on our backs."',
      '"But the truth will be out there. They can\'t un-ring that bell."',
    ],
    choices: [
      {
        id: 'do_it',
        text: '"Do it. Let\'s burn it all down."',
        effects: [
          { type: 'resource', target: 'exposure', value: 30 },
          { type: 'resource', target: 'morality', value: 15 },
          { type: 'faction', target: 'bloodlines', value: -20 },
          { type: 'faction', target: 'administrators', value: -15 },
        ],
        nextScene: 'ending_expose',
      },
    ],
  },

  shadow_path: {
    id: 'shadow_path',
    title: 'Quiet Pressure',
    location: 'Your Office',
    ambiance: 'tense',
    speaker: NPCS.maria_santos,
    narrative: [
      'Maria considers this, nodding slowly.',
    ],
    dialogue: [
      '"The subtle approach. Make them think twice before acting."',
      '"We leak pieces of the story to select outlets. Nothing that exposes my sources, but enough to make Reyes nervous. Then we let it be known that the full story is... insured."',
      '"Multiple copies. Multiple locations. Instructions to publish if anything happens to me."',
      '"It\'s not justice. But it might be survival."',
      'She meets your eyes.',
      '"And maybe, over time, we can chip away at their power. Death by a thousand cuts instead of one big blow."',
    ],
    choices: [
      {
        id: 'agree_shadow',
        text: '"It\'s the smart play. I\'ll help you set it up."',
        effects: [
          { type: 'resource', target: 'influence', value: 20 },
          { type: 'favor_gain', target: 'maria', value: { id: 'maria_owes_shadow', npcId: 'maria_santos', npcName: 'Maria Santos', description: 'Helped protect her story and sources', weight: 4, faction: 'reformists' } },
        ],
        nextScene: 'ending_shadow',
      },
    ],
  },

  cruz_path: {
    id: 'cruz_path',
    title: 'The Fixer\'s Game',
    location: 'Your Office',
    ambiance: 'dark',
    speaker: NPCS.maria_santos,
    narrative: [
      'Maria\'s expression goes cold.',
    ],
    dialogue: [
      '"Cruz? You want to involve Cruz?"',
      '"He\'s not a neutral party. He works for whoever pays him. Right now, that\'s the people who want me silent."',
      'But she hesitates.',
      '"Then again... Cruz cares about one thing: being useful to everyone. If he thinks you can offer him something better than Reyes..."',
      '"Just be careful. The Fixer doesn\'t have friends. He has interests."',
    ],
    documents: ['cruz_proposal'],
    choices: [
      {
        id: 'understand_risk',
        text: '"I understand the risk. I\'ll feel him out carefully."',
        effects: [
          { type: 'faction', target: 'fixers', value: 10 },
        ],
        nextScene: 'cruz_meeting',
      },
    ],
  },

  cruz_meeting: {
    id: 'cruz_meeting',
    title: 'The Fixer',
    location: 'An Unmarked Bar - Makati',
    ambiance: 'dark',
    speaker: NPCS.atty_cruz,
    narrative: [
      'Cruz chose the meeting spot. An unmarked door in an alley, a bar that doesn\'t appear on any map.',
      'He\'s already there when you arrive, nursing a glass of whiskey that costs more than most people make in a week.',
      'He doesn\'t stand when you enter. Doesn\'t smile. Just watches.',
    ],
    dialogue: [
      '"You met with the journalist."',
      'Not a question.',
      '"I know what she has. I know what she wants. And I know that you\'re thinking about helping her."',
      'He takes a slow sip.',
      '"The question is: what do you want? Because everyone wants something. And I can usually provide it."',
    ],
    choices: [
      {
        id: 'want_protection',
        text: '"I want to make sure I\'m on the winning side."',
        effects: [
          { type: 'faction', target: 'fixers', value: 10 },
        ],
        nextScene: 'cruz_deal',
        flavorText: 'Let him make an offer.',
      },
      {
        id: 'want_truth',
        text: '"I want the truth to come out. Can you help with that?"',
        effects: [
          { type: 'faction', target: 'reformists', value: 10 },
          { type: 'faction', target: 'fixers', value: -5 },
        ],
        nextScene: 'cruz_truth',
        flavorText: 'Test his limits.',
      },
      {
        id: 'want_info',
        text: '"I want to know what Reyes is planning."',
        effects: [
          { type: 'resource', target: 'influence', value: 10 },
        ],
        nextScene: 'cruz_info',
        flavorText: 'Information is power.',
      },
    ],
  },

  cruz_deal: {
    id: 'cruz_deal',
    title: 'The Offer',
    location: 'An Unmarked Bar - Makati',
    ambiance: 'tense',
    speaker: NPCS.atty_cruz,
    narrative: [
      'A thin smile crosses Cruz\'s face.',
    ],
    dialogue: [
      '"A pragmatist. I can work with that."',
      '"Here\'s the situation: Governor Reyes wants this story to disappear. He\'s willing to pay for that. A lot."',
      '"The journalist... she\'s idealistic. Those types usually end up dead or disillusioned. Either way, the story dies."',
      '"But you... you could live very comfortably. Help me convince her to take a \'fellowship\' abroad. Her sources stay safe. She stays alive. You get paid."',
      '"Everyone wins. Except maybe the truth."',
      'He slides an envelope across the table.',
      '"A down payment. For your consideration."',
    ],
    choices: [
      {
        id: 'take_money',
        text: 'Take the envelope.',
        effects: [
          { type: 'resource', target: 'influence', value: 30 },
          { type: 'resource', target: 'morality', value: -30 },
          { type: 'faction', target: 'fixers', value: 20 },
          { type: 'faction', target: 'reformists', value: -30 },
          { type: 'flag', target: 'took_cruz_money', value: true },
        ],
        nextScene: 'ending_betray',
        flavorText: 'The easy choice. The wrong one?',
      },
      {
        id: 'refuse_money',
        text: 'Push it back.',
        effects: [
          { type: 'resource', target: 'morality', value: 20 },
          { type: 'faction', target: 'fixers', value: -15 },
        ],
        nextScene: 'cruz_refused',
        flavorText: 'Some things aren\'t for sale.',
      },
    ],
  },

  cruz_refused: {
    id: 'cruz_refused',
    title: 'Bridges Burned',
    location: 'An Unmarked Bar - Makati',
    ambiance: 'dark',
    speaker: NPCS.atty_cruz,
    narrative: [
      'Cruz\'s expression doesn\'t change, but something hardens behind his eyes.',
    ],
    dialogue: [
      '"Interesting choice."',
      '"You understand what you\'re doing? Reyes isn\'t a forgiving man. And I...",',
      'He finishes his drink.',
      '"I always deliver what I\'m paid for. One way or another."',
      '"But I respect conviction. Even misguided conviction."',
      '"Good luck. You\'ll need it."',
    ],
    choices: [
      {
        id: 'leave_cruz',
        text: 'Leave and return to Maria.',
        effects: [
          { type: 'faction', target: 'reformists', value: 15 },
        ],
        nextScene: 'return_to_maria',
      },
    ],
  },

  cruz_truth: {
    id: 'cruz_truth',
    title: 'The Fixer\'s Truth',
    location: 'An Unmarked Bar - Makati',
    ambiance: 'tense',
    speaker: NPCS.atty_cruz,
    narrative: [
      'Cruz sets down his glass with deliberate care.',
    ],
    dialogue: [
      'Cruz laughs. It\'s not a pleasant sound.',
      '"The truth? The truth is a commodity like anything else. It has a price, and right now, nobody\'s willing to pay it."',
      '"But..."',
      'He leans forward.',
      '"If the truth is what you\'re selling, maybe I can find a buyer. There are people who would benefit from seeing Reyes humbled. People with deep pockets and old grudges."',
      '"The question is whether you\'re willing to trade one master for another."',
    ],
    choices: [
      {
        id: 'not_interested',
        text: '"I\'m not trading anyone. I\'m helping expose the truth."',
        effects: [
          { type: 'faction', target: 'reformists', value: 15 },
          { type: 'faction', target: 'fixers', value: -10 },
        ],
        nextScene: 'cruz_refused',
      },
      {
        id: 'tell_more',
        text: '"Who are these people with grudges?"',
        effects: [
          { type: 'flag', target: 'knows_other_players', value: true },
        ],
        nextScene: 'cruz_info',
      },
    ],
  },

  cruz_info: {
    id: 'cruz_info',
    title: 'Knowledge',
    location: 'An Unmarked Bar - Makati',
    ambiance: 'dark',
    narrative: [
      'Cruz\'s eyes narrow, calculating.',
    ],
    speaker: NPCS.atty_cruz,
    dialogue: [
      '"Reyes has enemies. Old families he stepped on to get where he is. Business rivals. Former allies he betrayed."',
      '"And then there\'s Director Mendoza. The bureaucrat thinks he\'s a partner, but Reyes sees him as a liability. When this story breaks—and it will break, one way or another—Mendoza will be sacrificed to protect the Governor."',
      '"Mendoza doesn\'t know this yet. But he suspects. A scared bureaucrat with access to everything... that\'s useful."',
      'He slides a card across the table.',
      '"My number. When you\'re ready to play the game properly, call me."',
    ],
    choices: [
      {
        id: 'take_card',
        text: 'Take the card and leave.',
        effects: [
          { type: 'flag', target: 'has_cruz_contact', value: true },
          { type: 'resource', target: 'influence', value: 10 },
        ],
        nextScene: 'return_to_maria',
      },
    ],
  },

  return_to_maria: {
    id: 'return_to_maria',
    title: 'Decision Time',
    location: 'A Safe House - Quezon City',
    ambiance: 'hopeful',
    speaker: NPCS.maria_santos,
    narrative: [
      'You find Maria at a safe house, surrounded by documents and the glow of laptop screens.',
      'She looks up when you enter, searching your face for answers.',
    ],
    dialogue: [
      '"You met with Cruz."',
      'Again, not a question.',
      '"And you\'re still here. That\'s either very good or very bad for me."',
      '"So? What did you decide?"',
    ],
    choices: [
      {
        id: 'go_public_final',
        text: '"We go public. All of it. Burn it down."',
        effects: [
          { type: 'faction', target: 'reformists', value: 20 },
          { type: 'resource', target: 'exposure', value: 30 },
        ],
        nextScene: 'ending_expose',
      },
      {
        id: 'shadow_final',
        text: '"We work the shadows. Slow and steady."',
        effects: [
          { type: 'resource', target: 'influence', value: 20 },
        ],
        nextScene: 'ending_shadow',
      },
    ],
  },

  // === ENDINGS ===

  ending_expose: {
    id: 'ending_expose',
    title: 'The Reckoning',
    location: 'Three Months Later',
    ambiance: 'hopeful',
    isEnding: true,
    endingType: 'expose',
    narrative: [
      'The story broke on an international wire service at 6 AM on a Monday.',
      'By noon, it was everywhere. The documents. The bank records. The testimonies. Everything.',
      'Governor Reyes called an emergency press conference to deny everything. He looked scared for the first time anyone could remember.',
      'Director Mendoza disappeared. Some say he\'s cooperating with investigators. Others say he\'s in witness protection. A few whisper that he was never found at all.',
      'Maria Santos became a symbol. Death threats turned to international awards. The Bloodhound became untouchable, at least for now.',
      'And you?',
      'You sit in a new office, in a city far from Manila. The phone rings sometimes with offers. Threats. Thanks.',
      'The corruption didn\'t end. It never ends. But three hundred and forty families got their story told. One dead fisherman got his name in the history books.',
      'In a world where power whispers, sometimes you have to shout.',
    ],
    choices: [],
  },

  ending_shadow: {
    id: 'ending_shadow',
    title: 'The Long Game',
    location: 'Six Months Later',
    ambiance: 'calm',
    isEnding: true,
    endingType: 'shadow',
    narrative: [
      'The story never broke. Not in full.',
      'Instead, it leaked. Piece by piece. A document here. A testimony there. Enough to make Governor Reyes nervous, but not enough to destroy him.',
      'He\'s more careful now. The land deals have slowed. The displaced families received better compensation—not justice, but something.',
      'Director Mendoza was quietly retired. He sends you Christmas cards from a beach house he shouldn\'t be able to afford.',
      'Maria Santos still publishes. Smaller stories. Safer targets. She\'s alive, which is more than some expected.',
      'And you?',
      'You\'re still in the game. Still walking the lines between factions. Cruz sends work your way sometimes. The Reformists trust you more than they used to.',
      'The truth is out there, waiting. A dead man\'s switch that keeps everyone honest. For now.',
      'In a world where power whispers, sometimes the best you can do is whisper back.',
    ],
    choices: [],
  },

  ending_betray: {
    id: 'ending_betray',
    title: 'The Price of Silence',
    location: 'One Year Later',
    ambiance: 'dark',
    isEnding: true,
    endingType: 'betray',
    narrative: [
      'Maria Santos accepted the fellowship. She writes about corruption in other countries now, from a safe distance.',
      'The documents were never published. The bank records disappeared. The testimonies faded into silence.',
      'Governor Reyes completed the coastal development. Five-star resorts where fishing villages used to stand. The families were relocated to government housing three hours from the sea.',
      'Mang Tonyo, the fisherman, is barely remembered. A footnote. A statistic.',
      'And you?',
      'The money was good. The conscience was expensive.',
      'You\'re richer now. Better connected. Cruz sends you work, and you never ask too many questions.',
      'Sometimes, late at night, you think about the envelope you never opened. The story you never told.',
      'But morning comes, and there\'s always another deal to make.',
      'In a world where power whispers, you learned to listen. Maybe that\'s all anyone can do.',
    ],
    choices: [],
  },

  ending_cycle: {
    id: 'ending_cycle',
    title: 'The Wheel Turns',
    location: 'Two Years Later',
    ambiance: 'dark',
    isEnding: true,
    endingType: 'cycle',
    narrative: [
      'You burned the documents that night. Watched them turn to ash in your office trash bin.',
      'Maria Santos was found dead three months later. Car accident. Very unfortunate. Very convenient.',
      'Governor Reyes completed the coastal development. Won re-election by a landslide. Rumor has it he\'s eyeing a senate seat.',
      'Director Mendoza is still at his desk. Still stamping papers. Still looking the other way.',
      'The three hundred and forty families are scattered now. No one remembers their names.',
      'And you?',
      'You\'re still here. Still consulting. Still walking the careful line.',
      'A new envelope sits on your desk. Different journalist. Different scandal. Same choices.',
      'In a world where power whispers, the story never really ends.',
      'It just waits for someone brave enough to tell it.',
    ],
    choices: [],
  },
};
