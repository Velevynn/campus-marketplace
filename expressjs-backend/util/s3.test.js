jest.mock('aws-sdk', () => {
    return {
      config: {
        update: jest.fn(),
      },
      S3: jest.fn(() => ({
        upload: jest.fn().mockReturnThis(),
        promise: jest.fn(),
      })),
    };
  });
  
  const { uploadImageToS3 } = require('./s3');
  
  describe('uploadImageToS3', () => {
    it('should upload image to S3', async () => {
      const mockedImageData = 'mocked image data';
      const mockedLocation = 'https://mocked-location.com/image.jpg';
      const imageName = 'test-image.jpg';
  
      // Mock the behavior of the AWS.S3 upload function
      const mockedS3Upload = jest.fn().mockReturnValueOnce({
        promise: jest.fn().mockResolvedValue({ Location: mockedLocation }),
      });
      const AWS = require('aws-sdk');
      AWS.S3.mockImplementationOnce(() => ({
        upload: mockedS3Upload,
      }));
  
      // Call the function to be tested
      const result = await uploadImageToS3(imageName, mockedImageData);
  
      // Assertions
      expect(result).toBe(mockedLocation);
      expect(mockedS3Upload).toHaveBeenCalledWith({
        Bucket: 'haggleimgs',
        Key: imageName,
        Body: mockedImageData,
      });
    });
  
    it('should throw error if upload fails', async () => {
      const mockedImageData = 'mocked image data';
      const imageName = 'test-image.jpg';
      const mockedError = new Error('Upload failed');
  
      // Mock the behavior of the AWS.S3 upload function to throw an error
      const mockedS3Upload = jest.fn().mockReturnValueOnce({
        promise: jest.fn().mockRejectedValueOnce(mockedError),
      });
      const AWS = require('aws-sdk');
      AWS.S3.mockImplementationOnce(() => ({
        upload: mockedS3Upload,
      }));
  
      // Call the function to be tested and expect it to throw an error
      await expect(uploadImageToS3(imageName, mockedImageData)).rejects.toThrow(mockedError);
    });
  });

