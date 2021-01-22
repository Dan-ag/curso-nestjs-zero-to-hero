import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

const mockCredentialDto = { username: 'TestUsername', password: ' TestPassword' };

describe( 'UserRepository', () => {
  let userRepository;

  beforeEach( async () => {
    const module = await Test.createTestingModule( {
      providers: [
        UserRepository,
      ]
    } ).compile();

    userRepository = await module.get<UserRepository>( UserRepository );
  } );

  describe( 'signUp', () => {
    let save;

    beforeEach( () => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue( { save } );
    } );

    it( 'succesfully signs up the user', async () => {
      save.mockResolvedValue( undefined );
      await expect( userRepository.signUp( mockCredentialDto ) ).resolves.not.toThrow();
    } );

    it( 'throws a conflict exception as username already exists', async () => {
      save.mockRejectedValue( { code: '23505' } );
      await expect( userRepository.signUp( mockCredentialDto ) ).rejects.toThrow( ConflictException );
    } );

    it( 'throws a conflict exception as username already exists', async () => {
      save.mockRejectedValue( { code: '12345' } );
      await expect( userRepository.signUp( mockCredentialDto ) ).rejects.toThrow( InternalServerErrorException );
    } );

  } );

  describe( 'validateUserPassword', () => {
    let user;

    beforeEach( () => {
      userRepository.findOne = jest.fn();

      user = new User();
      user.username = 'TestUsername';
      user.validatedPassword = jest.fn();
    } );


    it( 'returns the username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue( user );
      user.validatedPassword.mockResolvedValue( true );

      const result = await userRepository.validateUserPassword( mockCredentialDto );
      expect( result ).toEqual( 'TestUsername' );
    } );

    it( 'returns null as user connot be found', async () => {
      userRepository.findOne.mockResolvedValue( null );

      const result = await userRepository.validateUserPassword( mockCredentialDto );
      expect( user.validatedPassword ).not.toHaveBeenCalled();
      expect( result ).toBeNull();
    } );

    it( 'returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue( user );
      user.validatedPassword.mockResolvedValue( false );

      const result = await userRepository.validateUserPassword( mockCredentialDto );
      expect( user.validatedPassword ).toHaveBeenCalled();
      expect( result ).toBeNull();
    } );
  } );

  describe( 'hashPassword', () => {
    it( ' calls bcrypt.hash to generae a hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue( 'testHash' );
      expect( bcrypt.hash ).not.toHaveBeenCalled();

      const result = await userRepository.hashPassword( 'testPassword', 'testSalt' );
      expect( bcrypt.hash ).toHaveBeenCalledWith( 'testPassword', 'testSalt' );
      expect( result ).toEqual( 'testHash' );
    } );
  } );

} );
