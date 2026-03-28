import { intro, outro, text, select, multiselect, isCancel, cancel } from '@clack/prompts';

async function main() {
  intro('Create Lunar Kit App');
  const projectName = await text({
    message: 'What is your project named?',
    // initialValue: 'my-lunar-app',
    defaultValue: 'my-lunar-app',
    placeholder: 'my-lunar-app',
  });
  const features = await multiselect({
    message: 'Select features to include:',
    options: [
      { value: 'localization', label: 'Localization (i18n)' },
      { value: 'env', label: 'Environment config (.env)' }
    ],
    required: false
  });
  console.log({ projectName, features });
}
main();
