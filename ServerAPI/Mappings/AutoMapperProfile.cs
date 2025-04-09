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
                .ForMember(dest => dest.Subjects, opt => opt.MapFrom(src => src.TutorSubjects.Select(s => s.Name).ToList()))
                .ForMember(dest => dest.Hobbies, opt => opt.MapFrom(src => src.TutorHobbies.Select(h => h.Name).ToList()));    
                
        }
    }
}