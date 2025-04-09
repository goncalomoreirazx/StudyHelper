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
        }
    }
}