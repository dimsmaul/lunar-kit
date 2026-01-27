import { SelectSheet, MultiSelectSheet } from '@/components/ui/select-sheet';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useToolbar } from '@/hooks/useToolbar';

// Mock API function
// const fetchOptions = async (page: number) => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   const itemsPerPage = 20;
//   const totalPages = 5;

//   const data = Array.from({ length: itemsPerPage }, (_, i) => {
//     const id = (page - 1) * itemsPerPage + i + 1;
//     return {
//       label: `Option ${id}`,
//       value: id,
//     };
//   });

//   return {
//     data,
//     nextPage: page < totalPages ? page + 1 : undefined,
//     hasMore: page < totalPages,
//   };
// };

export default function SelectSheetView() {
  const [singleValue, setSingleValue] = React.useState<string | number>();
  const [multiValue, setMultiValue] = React.useState<(string | number)[]>([]);
  const [countryValue, setCountryValue] = React.useState<string | number>(); // ADD THIS
  const [skillsValue, setSkillsValue] = React.useState<(string | number)[]>([]); // ADD THIS

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['options'],
    queryFn: ({ pageParam = 1 }) => fetchOptions(pageParam as number),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const options = data?.pages.flatMap((page) => page.data) ?? [];

  useToolbar({
    title: 'Select Sheet',
  });

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-6">
        <View>
          <Text size="xl" variant='title' className="mb-4">
            Select Sheet Examples
          </Text>
        </View>

        {/* Single Select */}
        <View>
          <Text size="lg" variant='label' className="mb-2">
            Single Select
          </Text>
          <SelectSheet
            label="Choose an option"
            placeholder="Select one option..."
            options={options}
            value={singleValue}
            onValueChange={setSingleValue}
            onLoadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            isLoading={isFetchingNextPage}
            searchable
            searchPlaceholder="Search options..."
            title="Select an option"
            description="Choose one option from the list"
          />
          {singleValue && (
            <Text size="sm" className="text-muted-foreground mt-2">
              Selected: {options.find(opt => opt.value === singleValue)?.label}
            </Text>
          )}
        </View>

        {/* Multi Select */}
        <View>
          <Text size="lg" variant='label' className="mb-2">
            Multi Select
          </Text>
          <MultiSelectSheet
            label="Choose options"
            placeholder="Select multiple options..."
            options={options}
            value={multiValue}
            onValueChange={setMultiValue}
            onLoadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            isLoading={isFetchingNextPage}
            searchable
            searchPlaceholder="Search options..."
            title="Select options"
            description="Choose multiple options from the list"
            maxSelection={10}
            showCount
          />
          {multiValue.length > 0 && (
            <Text size="sm" className="text-muted-foreground mt-2">
              Selected {multiValue.length} items
            </Text>
          )}
        </View>

        {/* Single Select with Static Data */}
        <View>
          <Text size="lg" variant='label' className="mb-2">
            Static Options (No Infinite Scroll)
          </Text>
          <SelectSheet
            label="Country"
            placeholder="Select a country..."
            options={[
              { label: 'Indonesia', value: 'id' },
              { label: 'United States', value: 'us' },
              { label: 'United Kingdom', value: 'uk' },
              { label: 'Japan', value: 'jp' },
              { label: 'Singapore', value: 'sg' },
            ]}
            value={countryValue} // CHANGE THIS
            onValueChange={setCountryValue} // CHANGE THIS
            searchable
          />
          {countryValue && (
            <Text size="sm" className="text-muted-foreground mt-2">
              Selected: {countryValue}
            </Text>
          )}
        </View>

        {/* Multi Select with Max Selection */}
        <View>
          <Text size="lg" variant='label' className="mb-2">
            Max 3 Items
          </Text>
          <MultiSelectSheet
            label="Skills"
            placeholder="Select up to 3 skills..."
            options={[
              { label: 'React Native', value: 'rn' },
              { label: 'TypeScript', value: 'ts' },
              { label: 'Go', value: 'go' },
              { label: 'Python', value: 'py' },
              { label: 'Docker', value: 'docker' },
              { label: 'Kubernetes', value: 'k8s' },
            ]}
            value={skillsValue} // CHANGE THIS
            onValueChange={setSkillsValue} // CHANGE THIS
            maxSelection={3}
            showCount
          />
          {skillsValue.length > 0 && (
            <Text size="sm" className="text-muted-foreground mt-2">
              Selected: {skillsValue.join(', ')}
            </Text>
          )}
        </View>

        {/* Loading State Example */}
        {isLoading && (
          <View className="items-center py-4">
            <Text variant="muted">Loading initial data...</Text>
          </View>
        )}

        {/* Display Total Loaded */}
        <View className="items-center py-4 bg-muted rounded-lg">
          <Text size="sm" className="text-muted-foreground">
            Loaded {options.length} options
          </Text>
          <Text size="sm" className="text-muted-foreground mt-1">
            Scroll to bottom in sheet to load more
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const fetchOptions = async (page: number) => {
  const response = await fetch(
    `https://randomuser.me/api/?results=20&page=${page}`
  );
  const result = await response.json();

  const options = result.results.map((user: any, index: number) => ({
    label: `${user.name.first} ${user.name.last}`,
    value: `${page}-${index}`,
  }));

  return {
    data: options,
    nextPage: page < 5 ? page + 1 : undefined,
    hasMore: page < 5,
  };
};
