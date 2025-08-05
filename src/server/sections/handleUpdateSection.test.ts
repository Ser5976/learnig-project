import { handleUpdateSection } from '@/server/sections/handleUpdateSection';
import { ValidationError, DbError } from '../errors';
import { updateSection } from './updateSection';

jest.mock('./updateSection');

describe('handleUpdateSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('успешно обновляет секцию при валидных данных', async () => {
    const mockSection = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Test',
    };
    (updateSection as jest.Mock).mockResolvedValueOnce(mockSection);

    const result = await handleUpdateSection({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Test',
    });
    expect(result).toEqual(mockSection);
  });

  it('бросает ValidationError при невалидных данных', async () => {
    await expect(handleUpdateSection({ id: '', name: '' })).rejects.toThrow(
      ValidationError
    );
  });

  it('бросает DbError при ошибке БД', async () => {
    (updateSection as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(
      handleUpdateSection({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test',
      })
    ).rejects.toThrow(DbError);
  });
});
