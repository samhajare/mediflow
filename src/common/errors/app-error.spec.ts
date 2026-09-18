import { AppError, ErrorCode } from './app-error';

describe('AppError', () => {
  it('stores a safe code, status, message, and optional details', () => {
    const error = new AppError(ErrorCode.CONFLICT, 409, 'Conflict', {
      field: 'value',
    });
    expect(error).toMatchObject({
      code: 'CONFLICT',
      statusCode: 409,
      message: 'Conflict',
      details: { field: 'value' },
    });
  });
});
