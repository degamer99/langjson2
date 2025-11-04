
import type { Book } from '../types';

export const littlePrinceMock: Book = {
  id: 'lp-ar',
  title: 'The Little Prince',
  author: 'Antoine de Saint-Exupéry',
  languageCode: 'ar',
  chapters: [
    {
      number: 1,
      title: 'Chapter 1',
      paragraphs: [
        {
          id: 'p1',
          paragraphNumber: 1,
          words: [
            { id: 'w1-1', l2: 'عِنْدَمَا', l1: 'when' },
            { id: 'w1-2', l2: 'كُنْتُ', l1: 'I was' },
            { id: 'w1-3', l2: 'فِي', l1: 'in' },
            { id: 'w1-4', l2: 'السَّادِسَةِ', l1: 'the sixth' },
            { id: 'w1-5', l2: 'مِنْ', l1: 'from' },
            { id: 'w1-6', l2: 'عُمْرِي', l1: 'my age' },
            { id: 'w1-7', l2: 'رَأَيْتُ', l1: 'I saw' },
            { id: 'w1-8', l2: 'مَرَّةً', l1: 'once' },
            { id: 'w1-9', l2: 'صُورَةً', l1: 'a picture' },
            { id: 'w1-10', l2: 'رَائِعَةً', l1: 'magnificent' },
          ],
          translationL1: 'When I was six years old I saw a magnificent picture in a book, called True Stories from Nature, about the primeval forest.',
        },
        {
          id: 'p2',
          paragraphNumber: 2,
          words: [
            { id: 'w2-1', l2: 'كَانَتْ', l1: 'it was' },
            { id: 'w2-2', l2: 'تُمَثِّلُ', l1: 'it represents' },
            { id: 'w2-3', l2: 'أَفْعَى', l1: 'a snake' },
            { id: 'w2-4', l2: 'بُوَاء', l1: 'boa' },
            { id: 'w2-5', l2: 'عَاصِرَة', l1: 'constrictor' },
            { id: 'w2-6', l2: 'فِي', l1: 'in' },
            { id: 'w2-7', l2: 'عَمَلِيَّةِ', l1: 'the act of' },
            { id: 'w2-8', l2: 'ابْتِلَاعِ', l1: 'swallowing' },
            { id: 'w2-9', l2: 'حَيَوَانٍ', l1: 'an animal' },
          ],
          translationL1: 'It was a picture of a boa constrictor in the act of swallowing an animal.',
        },
        {
          id: 'p3',
          paragraphNumber: 3,
          words: [
            { id: 'w3-1', l2: 'سَأَلْتُهُ', l1: 'I asked him' },
            { id: 'w3-2', l2: 'أَنْ', l1: 'to' },
            { id: 'w3-3', l2: 'يَرْسُمَ', l1: 'draw' },
            { id: 'w3-4', l2: 'لِي', l1: 'for me' },
            { id: 'w3-5', l2: 'خَرُوفًا', l1: 'a sheep' },
          ],
          translationL1: 'So I asked him to draw me a sheep.',
        }
      ],
    },
  ],
};
