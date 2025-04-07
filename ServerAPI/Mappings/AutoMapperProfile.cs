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
        }
    }
}