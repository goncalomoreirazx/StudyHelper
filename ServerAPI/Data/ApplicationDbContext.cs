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
            
            // DO NOT configure a relationship between TutorSubject and Subject here
            // This avoids EF Core trying to create a shadow property
            
            // Configure Subject entity
            modelBuilder.Entity<Subject>(entity =>
            {
                entity.HasMany(s => s.SubSubjects)
                      .WithOne(ss => ss.Subject)
                      .HasForeignKey(ss => ss.SubjectId)
                      .OnDelete(DeleteBehavior.Cascade);
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
        }
    }
}