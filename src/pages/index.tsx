import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

// type Image = {
//   title: string;
//   description: string;
//   url: string;
//   ts: number;
//   id: string;
// };

// type imagesRequestReturn = {
//   data: Image[];
//   after: string;
// };

export default function Home(): JSX.Element {
  // const imagesRequest = async ({
  //   pageParam = null,
  // }): Promise<imagesRequestReturn> => {
  //   const response = await api.get('/api/images', {
  //     params: {
  //       after: pageParam?.after,
  //     },
  //   });
  //   return response.data;
  // };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam = null }) => {
      const response = await api.get('/api/images', {
        params: {
          after: pageParam?.after,
        },
      });
      return response.data;
    },
    {
      getNextPageParam: lastPage => (lastPage?.after ? lastPage : null),
    }
  );

  const formattedData = useMemo(() => {
    return data?.pages?.flatMap(image => image.data);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }
  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
