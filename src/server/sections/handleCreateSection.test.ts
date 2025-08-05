import { handleCreateSection } from './handleCreateSection';
import { createSection } from './createSection';
import { ValidationError, DbError } from '../errors';

jest.mock('./createSection');

describe('handleCreateSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('успешно создаёт секцию при валидных данных', async () => {
    const mockSection = { id: '1', name: 'Test' };
    (createSection as jest.Mock).mockResolvedValueOnce(mockSection);

    const result = await handleCreateSection({ name: 'Test' });
    expect(result).toEqual(mockSection);
  });

  it('бросает ValidationError при невалидных данных', async () => {
    await expect(handleCreateSection({ name: '' })).rejects.toThrow(
      ValidationError
    );
  });

  it('бросает DbError при ошибке БД', async () => {
    (createSection as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(handleCreateSection({ name: 'Test' })).rejects.toThrow(
      DbError
    );
  });
});
