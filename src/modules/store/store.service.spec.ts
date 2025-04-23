import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { DrizzleService } from '@app/common/drizzle/drizzle.service';
import { CachingService } from '@app/common/caching/caching.service';
import { NotFoundException } from '@nestjs/common';
import { StoreModel } from '@app/common/drizzle/models.type';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { CreateStoreDto } from './dtos/create-store.dto';

describe('StoreService', () => {
  let service: StoreService;

  const mockStore: StoreModel = {
    id: 'mock-store-id',
    cursor: 1,
    name: 'Test Store',
    description: 'Test Description',
    ownerId: 'user-123',
    isVerified: false,
    rating: null,
    contactNumber: null,
    logo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const drizzleMock = {
    client: {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockStore]),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      query: {
        store: {
          findFirst: jest.fn(),
        },
      },
    },
  };

  const cacheMock: Partial<CachingService> = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        { provide: DrizzleService, useValue: drizzleMock },
        { provide: CachingService, useValue: cacheMock },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should create a store', async () => {
    const dto = { name: 'Test Store', description: 'Test' };
    const result = await service.create(dto as CreateStoreDto, 'user-123');
    expect(result).toEqual(mockStore);
  });

  it('should return cached store if available', async () => {
    (cacheMock.get as jest.Mock).mockResolvedValue(mockStore);

    const result = await service.findOne('mock-store-id');
    expect(result).toEqual(mockStore);
    expect(cacheMock.get).toHaveBeenCalledWith('store:mock-store-id');
  });

  it('should fetch store from DB and cache it if not cached', async () => {
    (cacheMock.get as jest.Mock).mockResolvedValue(undefined);
    drizzleMock.client.query.store.findFirst.mockResolvedValue(mockStore);

    const result = await service.findOne('mock-store-id');

    expect(result).toEqual(mockStore);
    expect(drizzleMock.client.query.store.findFirst).toHaveBeenCalled();
    expect(cacheMock.set).toHaveBeenCalledWith('store:mock-store-id', mockStore);
  });

  it('should throw NotFoundException if store does not exist', async () => {
    (cacheMock.get as jest.Mock).mockResolvedValue(undefined);
    drizzleMock.client.query.store.findFirst.mockResolvedValue(null);

    await expect(service.findOne('not-found')).rejects.toThrow(NotFoundException);
  });

  it('should update a store and delete cache', async () => {
    drizzleMock.client.returning.mockResolvedValue([mockStore]);

    const dto = { name: 'Updated Name' };
    const result = await service.update('mock-store-id', dto as UpdateStoreDto);

    expect(result).toEqual(mockStore);
    expect(cacheMock.del).toHaveBeenCalledWith('store:mock-store-id');
  });
});