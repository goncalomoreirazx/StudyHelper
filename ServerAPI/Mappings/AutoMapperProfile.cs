using AutoMapper;
using ServerAPI.DTOs;
using ServerAPI.Models;

namespace ServerAPI.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Map User -> UserDto
            CreateMap<User, UserDto>();
            
            // Map RegisterRequest -> User
            CreateMap<RegisterRequest, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            // Map Tutor -> TutorDto
            CreateMap<Tutor, TutorDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                // Simplified mapping for subjects - just use the names directly
                .ForMember(dest => dest.Subjects, opt => opt.MapFrom(src => src.TutorSubjects.Select(ts => ts.Name).ToList()))
                .ForMember(dest => dest.Hobbies, opt => opt.MapFrom(src => src.TutorHobbies.Select(h => h.Name).ToList()));    


            // Map Subject -> SubjectDto
            CreateMap<Subject, SubjectDto>();
            
            // Map SubSubject -> SubSubjectDto
            CreateMap<SubSubject, SubSubjectDto>();
            
            // Map TutorSession -> TutorSessionDto
            CreateMap<TutorSession, TutorSessionDto>()
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => $"{src.Student.FirstName} {src.Student.LastName}"))
                .ForMember(dest => dest.TutorName, opt => opt.MapFrom(src => $"{src.Tutor.User.FirstName} {src.Tutor.User.LastName}"))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.Name))
                .ForMember(dest => dest.SubSubjectName, opt => opt.MapFrom(src => src.SubSubject != null ? src.SubSubject.Name : null))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString(@"hh\:mm")))
                .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.EndTime.ToString(@"hh\:mm")))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
                
            // Map TutorAvailability -> TutorAvailabilityDto
            CreateMap<TutorAvailability, TutorAvailabilityDto>()
                .ForMember(dest => dest.DayOfWeek, opt => opt.MapFrom(src => src.DayOfWeek.ToString()))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString(@"hh\:mm")))
                .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.EndTime.ToString(@"hh\:mm")));
        }
    }
}