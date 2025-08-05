import { ValidationError, DbError } from '../errors';
import { deleteSection } from './deleteSection';
import { handleDeleteSection } from './handleDeleteSection';

jest.mock('./deleteSection');

describe('handleDeleteSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('успешно удаляет секцию при валидных данных', async () => {
    const mockSection = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Test',
    };
    (deleteSection as jest.Mock).mockResolvedValueOnce(mockSection);

    const result = await handleDeleteSection({
      id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result).toEqual(mockSection);
  });

  it('бросает ValidationError при невалидных данных', async () => {
    await expect(handleDeleteSection({ id: '123' })).rejects.toThrow(
      ValidationError
    );
  });

  it('бросает DbError при ошибке БД', async () => {
    (deleteSection as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(
      handleDeleteSection({
        id: '550e8400-e29b-41d4-a716-446655440000',
      })
    ).rejects.toThrow(DbError);
  });
});
