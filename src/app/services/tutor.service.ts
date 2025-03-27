// src/app/services/tutor.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tutor } from '../models/tutor.model';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private tutors: Tutor[] = [
    {
      id: 1,
      name: "Dr. Emily Parker",
      profession: "Mathematics Professor",
      hobbies: ["Chess", "Mountain climbing", "Piano"],
      rating: 4.9,
      bio: "With over 15 years of teaching experience at university level, Dr. Parker specializes in making complex math concepts accessible to students of all ages. She holds a PhD in Applied Mathematics from MIT.",
      subjects: ["Calculus", "Linear Algebra", "Statistics", "Discrete Mathematics"],
      experience: 15
    },
    {
      id: 2,
      name: "Michael Chen",
      profession: "Software Engineer",
      hobbies: ["Coding", "Gaming", "Tennis"],
      rating: 4.8,
      bio: "Michael works as a senior software engineer at a leading tech company and has been teaching programming on the side for 7 years. He's passionate about helping students build practical coding skills.",
      subjects: ["Python", "Java", "Web Development", "Data Structures & Algorithms"],
      experience: 7
    },
    {
      id: 3,
      name: "Dr. Sarah Williams",
      profession: "Research Biologist",
      hobbies: ["Hiking", "Bird watching", "Gardening"],
      rating: 4.7,
      bio: "Dr. Williams brings science to life through her engaging teaching style. With a background in research biology, she excels at explaining complex scientific concepts using real-world examples.",
      subjects: ["Biology", "Chemistry", "Environmental Science", "Scientific Writing"],
      experience: 10
    },
    {
      id: 4,
      name: "James Rodriguez",
      profession: "Historical Author",
      hobbies: ["Archery", "Ancient literature", "Travel"],
      rating: 4.9,
      bio: "James has published three books on European history and specializes in making historical events engaging and relevant to today's students. His storytelling approach makes history lessons unforgettable.",
      subjects: ["World History", "European History", "Historical Writing", "Political Science"],
      experience: 12
    },
    {
      id: 5,
      name: "Aisha Khan",
      profession: "Linguistics Researcher",
      hobbies: ["Poetry", "International cuisine", "Cultural studies"],
      rating: 4.8,
      bio: "Multilingual and passionate about language learning, Aisha specializes in helping students master new languages quickly. She has developed several innovative techniques for vocabulary acquisition.",
      subjects: ["Spanish", "French", "Arabic", "ESL/TEFL"],
      experience: 8
    },
    {
      id: 6,
      name: "Robert Davis",
      profession: "Physics Educator",
      hobbies: ["Amateur astronomy", "Robotics", "Hiking"],
      rating: 4.6,
      bio: "Robert makes physics fun and accessible through hands-on experiments and real-world applications. His students consistently achieve top scores on AP and IB physics exams.",
      subjects: ["Physics", "Astronomy", "Engineering Principles", "Mechanics"],
      experience: 9
    },
    {
      id: 7,
      name: "Jennifer Lee",
      profession: "Literary Editor",
      hobbies: ["Creative writing", "Book collecting", "Theater"],
      rating: 4.9,
      bio: "Jennifer has worked with major publishing houses and helps students develop strong writing skills across various genres. Her feedback is known for being both constructive and encouraging.",
      subjects: ["English Literature", "Creative Writing", "Essay Writing", "Grammar"],
      experience: 11
    },
    {
      id: 8,
      name: "David Wilson",
      profession: "Data Scientist",
      hobbies: ["Statistical analysis", "Machine learning", "Photography"],
      rating: 4.7,
      bio: "David combines his industry experience in data science with a talent for breaking down complex statistical concepts. He specializes in preparing students for careers in data and analytics.",
      subjects: ["Statistics", "Data Analysis", "Machine Learning", "R Programming"],
      experience: 6
    },
    {
      id: 9,
      name: "Maria Gonzalez",
      profession: "Art Historian",
      hobbies: ["Painting", "Museum visits", "Art restoration"],
      rating: 4.8,
      bio: "Maria brings art history to life through virtual museum tours and engaging discussions about artistic techniques. She helps students develop critical analysis skills through art appreciation.",
      subjects: ["Art History", "Visual Arts", "Art Theory", "Classical Studies"],
      experience: 10
    },
    {
      id: 10,
      name: "Thomas Zhang",
      profession: "Chemical Engineer",
      hobbies: ["Molecular gastronomy", "Chess", "Scuba diving"],
      rating: 4.6,
      bio: "Thomas makes chemistry engaging through his innovative teaching methods that connect chemical principles to everyday phenomena. His background in chemical engineering provides valuable industry insights.",
      subjects: ["Chemistry", "Biochemistry", "Engineering", "Chemical Physics"],
      experience: 8
    },
    {
      id: 11,
      name: "Olivia Martinez",
      profession: "Economics Professor",
      hobbies: ["Financial markets", "International travel", "Podcasting"],
      rating: 4.8,
      bio: "Olivia helps students understand complex economic theories by connecting them to current events and real-world scenarios. Her students consistently excel in AP/IB Economics and college courses.",
      subjects: ["Economics", "Business Studies", "Finance", "Market Analysis"],
      experience: 9
    },
    {
      id: 12,
      name: "Daniel Kim",
      profession: "Music Composer",
      hobbies: ["Playing multiple instruments", "Songwriting", "Sound engineering"],
      rating: 4.9,
      bio: "Daniel has worked in the music industry for over a decade and brings practical experience to his music lessons. He tailors his teaching approach to each student's learning style and musical interests.",
      subjects: ["Music Theory", "Composition", "Piano", "Guitar"],
      experience: 12
    },
    {
      id: 13,
      name: "Sophia Patel",
      profession: "Child Psychologist",
      hobbies: ["Child development research", "Yoga", "Educational games design"],
      rating: 4.8,
      bio: "Sophia specializes in working with younger students and those with learning differences. Her background in child psychology informs her patient, adaptive teaching approach.",
      subjects: ["Early Childhood Education", "Social Sciences", "Study Skills", "Psychology"],
      experience: 10
    },
    {
      id: 14,
      name: "Marcus Johnson",
      profession: "Physical Trainer",
      hobbies: ["Sports coaching", "Nutrition", "Outdoor activities"],
      rating: 4.7,
      bio: "Marcus combines his knowledge of physical education with motivational techniques to help students excel in both theoretical and practical aspects of physical education.",
      subjects: ["Physical Education", "Health Science", "Sports Theory", "Nutrition"],
      experience: 7
    },
    {
      id: 15,
      name: "Emma Thompson",
      profession: "Environmental Scientist",
      hobbies: ["Sustainability projects", "Wildlife photography", "Kayaking"],
      rating: 4.8,
      bio: "Emma brings environmental science to life through field studies and real-world sustainability projects. She inspires students to apply scientific principles to address environmental challenges.",
      subjects: ["Environmental Science", "Geography", "Ecology", "Earth Sciences"],
      experience: 8
    },
    {
      id: 16,
      name: "Carlos Mendez",
      profession: "Digital Marketing Specialist",
      hobbies: ["Social media analysis", "Graphic design", "Technology trends"],
      rating: 4.6,
      bio: "Carlos brings cutting-edge industry knowledge to his business and marketing lessons. His practical approach helps students develop marketable skills for the digital economy.",
      subjects: ["Business Studies", "Marketing", "Digital Media", "Entrepreneurship"],
      experience: 6
    },
    {
      id: 17,
      name: "Grace Liu",
      profession: "Computer Science Researcher",
      hobbies: ["AI development", "Competitive programming", "Technology ethics"],
      rating: 4.9,
      bio: "Grace specializes in advanced computer science topics and has mentored numerous students to success in programming competitions and college admissions.",
      subjects: ["Computer Science", "Artificial Intelligence", "Algorithms", "Competitive Programming"],
      experience: 9
    },
    {
      id: 18,
      name: "Benjamin Okafor",
      profession: "Civil Engineer",
      hobbies: ["Architectural design", "Model building", "Urban planning"],
      rating: 4.7,
      bio: "Benjamin connects mathematical concepts to real-world engineering applications, making abstract principles concrete and accessible for his students.",
      subjects: ["Mathematics", "Physics", "Engineering", "Technical Drawing"],
      experience: 10
    },
    {
      id: 19,
      name: "Amelia Wright",
      profession: "Speech Pathologist",
      hobbies: ["Linguistics research", "Theater", "Sign language"],
      rating: 4.8,
      bio: "Amelia specializes in helping students with communication challenges excel academically. Her background in speech pathology informs her patient, structured teaching approach.",
      subjects: ["English", "Communications", "Public Speaking", "Study Skills"],
      experience: 8
    },
    {
      id: 20,
      name: "Alexander Rivera",
      profession: "Political Analyst",
      hobbies: ["International relations", "Debate coaching", "History"],
      rating: 4.8,
      bio: "Alexander brings government and politics to life by connecting historical events to current political developments. His students excel in debate competitions and political science courses.",
      subjects: ["Government & Politics", "History", "Debate", "International Relations"],
      experience: 9
    }
  ];

  constructor() { }

  /**
   * Get all tutors
   */
  getAllTutors(): Observable<Tutor[]> {
    return of(this.tutors);
  }

  /**
   * Get paginated tutors with optional subject filtering
   * @param page Page number (0-based)
   * @param pageSize Number of tutors per page
   * @param subject Optional subject filter
   */
  getTutorsPaginated(page: number, pageSize: number, subject?: string | null): Observable<{tutors: Tutor[], total: number}> {
    console.log(`Service - Getting page ${page}, size ${pageSize}, subject: ${subject || 'All'}`);
    
    // First filter by subject if provided
    let filteredTutors = this.tutors;
    if (subject) {
      filteredTutors = this.tutors.filter(tutor => 
        tutor.subjects.some(s => s.toLowerCase() === subject.toLowerCase())
      );
    }
    
    // Ensure valid page number
    const totalPages = Math.ceil(filteredTutors.length / pageSize);
    if (page >= totalPages) {
      page = Math.max(0, totalPages - 1);
    }
    
    // Then paginate the filtered results
    const startIndex = page * pageSize;
    const paginatedTutors = filteredTutors.slice(startIndex, startIndex + pageSize);
    
    console.log(`Service - Returning ${paginatedTutors.length} tutors, total: ${filteredTutors.length}`);
    
    return of({
      tutors: paginatedTutors,
      total: filteredTutors.length
    });
  }

  /**
   * Get a tutor by ID
   * @param id Tutor ID
   */
  getTutorById(id: number): Observable<Tutor | undefined> {
    const tutor = this.tutors.find(t => t.id === id);
    return of(tutor);
  }
}