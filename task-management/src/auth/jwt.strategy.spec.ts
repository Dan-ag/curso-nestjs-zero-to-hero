import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';


const mockUserRepository = () => ( {
  findOne: jest.fn(),
} );

describe( 'JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach( async () => {
    const module = await Test.createTestingModule( {
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository }
      ]
    } ).compile();

    userRepository = await module.get<UserRepository>( UserRepository );
    jwtStrategy = await module.get<JwtStrategy>( JwtStrategy );
  } );

  describe( 'validate', () => {
    beforeEach( () => {
      userRepository.findOne = jest.fn();
    } );

    it( 'validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'TestUser';

      userRepository.findOne.mockResolvedValue( user );
      const result = await jwtStrategy.validate( { username: 'TestUser' } );

      expect( userRepository.findOne ).toHaveBeenCalledWith( { username: 'TestUser' } );
      expect( result ).toEqual( user );
    } );

    it( 'throw an unthorized exception as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue( null );
      await expect( jwtStrategy.validate( { username: 'TestUser' } ) ).rejects.toThrow( UnauthorizedException );
    } );

  } );
} );