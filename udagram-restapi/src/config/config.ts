import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  'dev': {
    'username': process.env.POSTGRES_USER,
    'password': process.env.POSTGRES_PASSWORD,
    'database': process.env.POSTGRES_DB,
    'host': process.env.POSTGRES_HOST,
    'port': 5432,
    'dialect': 'postgres',
    'aws_region': 'us-east-1',
    'aws_profile': 'local',
    'aws_media_bucket': 'udagram',
  },
  'jwt': {
    'secret': process.env.JWT_SECRET,
  },
  'prod': {
    'username': process.env.POSTGRES_USER,
    'password': process.env.POSTGRES_PASSWORD,
    'database': process.env.POSTGRES_DB,
    'host': process.env.POSTGRES_HOST,
    'dialect': 'postgres',
    'port': 5432,
  }
};
