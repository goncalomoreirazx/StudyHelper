// src/app/pages/home/home.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Parent',
      image: 'assets/images/testimonial1.jpg',
      quote: 'StudyHelper transformed my daughter\'s academic journey. Her confidence has soared and her grades have improved dramatically. The tutors are not only knowledgeable but genuinely care about student success.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'College Student',
      image: 'assets/images/testimonial2.jpg',
      quote: 'As a pre-med student, I was struggling with organic chemistry until I found StudyHelper. My tutor broke down complex concepts into manageable pieces and helped me ace my final exam. Worth every penny!'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'High School Student',
      image: 'assets/images/testimonial3.jpg',
      quote: 'I\'ve tried several tutoring services but StudyHelper stands out. The personalized approach and flexible scheduling made a huge difference. I\'ve improved from a C to an A in calculus in just two months.'
    }
  ];

  subjects = [
    {
      name: 'Mathematics',
      icon: '📊',
      description: 'Master everything from basic arithmetic to advanced calculus with our expert math tutors. We simplify complex concepts and build strong foundations.'
    },
    {
      name: 'Science',
      icon: '🧪',
      description: 'Explore biology, chemistry, physics, and more with hands-on learning approaches. Our science tutors make difficult theories accessible and engaging.'
    },
    {
      name: 'English',
      icon: '📝',
      description: 'Develop strong writing skills, reading comprehension, and literary analysis. Our English tutors help you communicate effectively and think critically.'
    },
    {
      name: 'History',
      icon: '🏛️',
      description: 'Understand the past and its impact on our present with engaging history lessons covering world civilizations, cultural developments, and key historical events.'
    },
    {
      name: 'Languages',
      icon: '🌍',
      description: 'Learn Spanish, French, Mandarin, German and more with native-speaking tutors. Our language instruction focuses on conversation, grammar, and cultural context.'
    },
    {
      name: 'Programming',
      icon: '💻',
      description: 'Build your coding skills with expert instruction in Python, Java, JavaScript, and more. From beginners to advanced developers, we guide you through practical projects.'
    }
  ];

  ngAfterViewInit() {
    this.initFaqToggle();
  }

  initFaqToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question?.addEventListener('click', () => {
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current FAQ item
        item.classList.toggle('active');
      });
    });
  }
}