using Microsoft.EntityFrameworkCore;
using ServerAPI.Models;

namespace ServerAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Tutor> Tutors { get; set; }
        public DbSet<TutorSubject> TutorSubjects { get; set; }
        public DbSet<TutorHobby> TutorHobbies { get; set; }
        
        // New DbSets
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<SubSubject> SubSubjects { get; set; }
        public DbSet<TutorSession> TutorSessions { get; set; }
        public DbSet<TutorAvailability> TutorAvailabilities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                
                // Configure one-to-many relationship with RefreshTokens
                entity.HasMany(u => u.RefreshTokens)
                      .WithOne(r => r.User)
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Tutor entity
            modelBuilder.Entity<Tutor>(entity =>
            {
                entity.HasOne(t => t.User)
                      .WithOne()
                      .HasForeignKey<Tutor>(t => t.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasMany(t => t.TutorSubjects)
                      .WithOne(ts => ts.Tutor)
                      .HasForeignKey(ts => ts.TutorId)
                      .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasMany(t => t.TutorHobbies)
                      .WithOne(th => th.Tutor)
                      .HasForeignKey(th => th.TutorId)
                      .OnDelete(DeleteBehavior.Cascade);
                      
                entity.HasMany(t => t.Availabilities)
                      .WithOne(a => a.Tutor)
                      .HasForeignKey(a => a.TutorId)
                      .OnDelete(DeleteBehavior.Cascade);
                      
                entity.HasMany(t => t.Sessions)
                      .WithOne(s => s.Tutor)
                      .HasForeignKey(s => s.TutorId)
                      .OnDelete(DeleteBehavior.Restrict); // Don't delete sessions if tutor is deleted
            });
            
            // Configure Subject entity
            modelBuilder.Entity<TutorSubject>(entity =>
            {
                entity.HasOne(ts => ts.Tutor)
                    .WithMany(t => t.TutorSubjects)
                    .HasForeignKey(ts => ts.TutorId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                // Comment out or remove the Subject relationship configuration
                // entity.HasOne(ts => ts.Subject)
                //       .WithMany(s => s.TutorSubjects)
                //       .HasForeignKey(ts => ts.SubjectId)
                //       .OnDelete(DeleteBehavior.Restrict);
            });
            
            // Configure TutorSession entity
            modelBuilder.Entity<TutorSession>(entity =>
            {
                entity.HasOne(ts => ts.Student)
                      .WithMany()
                      .HasForeignKey(ts => ts.StudentId)
                      .OnDelete(DeleteBehavior.Restrict); // Don't delete sessions if student is deleted
                      
                entity.HasOne(ts => ts.Subject)
                      .WithMany()
                      .HasForeignKey(ts => ts.SubjectId)
                      .OnDelete(DeleteBehavior.Restrict); // Don't delete sessions if subject is deleted
                      
                entity.HasOne(ts => ts.SubSubject)
                      .WithMany()
                      .HasForeignKey(ts => ts.SubSubjectId)
                      .OnDelete(DeleteBehavior.Restrict); // Don't delete sessions if sub-subject is deleted
            });

            // Add seed data
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@studyhelper.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = UserRole.ADMIN,
                    CreatedAt = DateTime.UtcNow
                }
            );
            
            // Seed subjects with sub-subjects
            modelBuilder.Entity<Subject>().HasData(
                new Subject
                {
                    Id = 1,
                    Name = "Mathematics",
                    Description = "Learn everything from basic arithmetic to advanced calculus with our expert math tutors.",
                    Icon = "📊"
                },
                new Subject
                {
                    Id = 2,
                    Name = "Science",
                    Description = "Explore biology, chemistry, physics, and more with hands-on learning approaches.",
                    Icon = "🧪"
                },
                new Subject
                {
                    Id = 3,
                    Name = "English",
                    Description = "Develop strong writing skills, reading comprehension, and literary analysis.",
                    Icon = "📝"
                },
                new Subject
                {
                    Id = 4,
                    Name = "History",
                    Description = "Understand the past and its impact on our present with engaging history lessons.",
                    Icon = "🏛️"
                },
                new Subject
                {
                    Id = 5,
                    Name = "Languages",
                    Description = "Learn Spanish, French, Mandarin, German and more with native-speaking tutors.",
                    Icon = "🌍"
                },
                new Subject
                {
                    Id = 6,
                    Name = "Computer Science",
                    Description = "Build your coding skills with expert instruction in programming, algorithms, and more.",
                    Icon = "💻"
                }
            );
            
            // Seed sub-subjects
            modelBuilder.Entity<SubSubject>().HasData(
                // Mathematics
                new SubSubject { Id = 1, SubjectId = 1, Name = "Algebra" },
                new SubSubject { Id = 2, SubjectId = 1, Name = "Calculus" },
                new SubSubject { Id = 3, SubjectId = 1, Name = "Geometry" },
                new SubSubject { Id = 4, SubjectId = 1, Name = "Statistics" },
                new SubSubject { Id = 5, SubjectId = 1, Name = "Trigonometry" },
                
                // Science
                new SubSubject { Id = 6, SubjectId = 2, Name = "Biology" },
                new SubSubject { Id = 7, SubjectId = 2, Name = "Chemistry" },
                new SubSubject { Id = 8, SubjectId = 2, Name = "Physics" },
                new SubSubject { Id = 9, SubjectId = 2, Name = "Environmental Science" },
                
                // English
                new SubSubject { Id = 10, SubjectId = 3, Name = "Grammar" },
                new SubSubject { Id = 11, SubjectId = 3, Name = "Literature" },
                new SubSubject { Id = 12, SubjectId = 3, Name = "Writing" },
                new SubSubject { Id = 13, SubjectId = 3, Name = "Composition" },
                
                // History
                new SubSubject { Id = 14, SubjectId = 4, Name = "World History" },
                new SubSubject { Id = 15, SubjectId = 4, Name = "American History" },
                new SubSubject { Id = 16, SubjectId = 4, Name = "European History" },
                new SubSubject { Id = 17, SubjectId = 4, Name = "Political Science" },
                
                // Languages
                new SubSubject { Id = 18, SubjectId = 5, Name = "Spanish" },
                new SubSubject { Id = 19, SubjectId = 5, Name = "French" },
                new SubSubject { Id = 20, SubjectId = 5, Name = "German" },
                new SubSubject { Id = 21, SubjectId = 5, Name = "Chinese" },
                
                // Computer Science
                new SubSubject { Id = 22, SubjectId = 6, Name = "Programming" },
                new SubSubject { Id = 23, SubjectId = 6, Name = "Data Structures" },
                new SubSubject { Id = 24, SubjectId = 6, Name = "Algorithms" },
                new SubSubject { Id = 25, SubjectId = 6, Name = "Web Development" }
            );
        }
    }
}