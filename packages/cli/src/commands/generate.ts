import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

interface LunarConfig {
  navigation: 'expo-router' | 'react-navigation' | 'none';
  features: string[];
  componentsDir: string;
  uiComponentsDir: string;
}

async function loadConfig(): Promise<LunarConfig | null> {
  const configPath = path.join(process.cwd(), 'lunar-kit.config.json');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  return await fs.readJson(configPath);
}

export async function generateScreen(name: string) {
  const spinner = ora('Generating screen...').start();
  
  try {
    const config = await loadConfig();
    
    if (!config) {
      spinner.fail('lunar-kit.config.json not found. Did you create this project with create-lunar-kit?');
      return;
    }

    const response = await prompts([
      {
        type: 'select',
        name: 'template',
        message: 'Choose screen template:',
        choices: [
          { title: 'Basic (empty screen)', value: 'basic' },
          { title: 'List (with FlatList)', value: 'list' },
          { title: 'Form (with inputs)', value: 'form' },
          { title: 'Detail (with scroll)', value: 'detail' },
        ],
        initial: 0,
      },
    ]);

    const { template } = response;
    const fileName = name.charAt(0).toUpperCase() + name.slice(1);

    let screenContent = '';

    switch (template) {
      case 'basic':
        screenContent = generateBasicScreen(fileName);
        break;
      case 'list':
        screenContent = generateListScreen(fileName);
        break;
      case 'form':
        screenContent = generateFormScreen(fileName);
        break;
      case 'detail':
        screenContent = generateDetailScreen(fileName);
        break;
    }

    // Determine path based on navigation type
    let screenPath = '';
    if (config.navigation === 'expo-router') {
      screenPath = path.join(process.cwd(), 'app', `${name.toLowerCase()}.tsx`);
    } else {
      screenPath = path.join(process.cwd(), config.componentsDir, `${fileName}Screen.tsx`);
    }

    await fs.ensureDir(path.dirname(screenPath));
    await fs.writeFile(screenPath, screenContent);

    spinner.succeed(chalk.green(`Screen created: ${screenPath}`));
  } catch (error) {
    spinner.fail('Failed to generate screen');
    console.error(error);
  }
}

export async function generateComponent(name: string) {
  const spinner = ora('Generating component...').start();
  
  try {
    const fileName = name.charAt(0).toUpperCase() + name.slice(1);
    const componentContent = `import { View, Text } from 'react-native';

interface ${fileName}Props {
  // Add your props here
}

export function ${fileName}({}: ${fileName}Props) {
  return (
    <View className="p-4">
      <Text className="text-lg font-semibold">${fileName}</Text>
    </View>
  );
}`;

    const componentPath = path.join(process.cwd(), 'components', `${fileName}.tsx`);
    await fs.ensureDir(path.dirname(componentPath));
    await fs.writeFile(componentPath, componentContent);

    spinner.succeed(chalk.green(`Component created: ${componentPath}`));
  } catch (error) {
    spinner.fail('Failed to generate component');
    console.error(error);
  }
}

function generateBasicScreen(name: string): string {
  return `import { View, Text } from 'react-native';

export default function ${name}Screen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">${name}</Text>
    </View>
  );
}`;
}

function generateListScreen(name: string): string {
  return `import { View, Text, FlatList } from 'react-native';

const data = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
];

export default function ${name}Screen() {
  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg">{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}`;
}

function generateFormScreen(name: string): string {
  return `import { View, Text, TextInput } from 'react-native';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ${name}Screen() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">${name}</Text>
      
      <View className="mb-4">
        <Text className="mb-2">Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
      </View>

      <Button onPress={handleSubmit}>Submit</Button>
    </View>
  );
}`;
}

function generateDetailScreen(name: string): string {
  return `import { View, Text, ScrollView } from 'react-native';

export default function ${name}Screen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-3xl font-bold mb-4">${name} Detail</Text>
        <Text className="text-gray-600 leading-6">
          Add your content here...
        </Text>
      </View>
    </ScrollView>
  );
}`;
}
