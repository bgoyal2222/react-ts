import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Basketball } from "phosphor-react";

import ButtonV2 from ".";

const PLACEHOLDER_TEXT = "Button";

export default {
  title: "Core/ButtonV2",
  component: ButtonV2,
} as ComponentMeta<typeof ButtonV2>;

const Template: ComponentStory<typeof ButtonV2> = (args) => (
  <ButtonV2 {...args}>
    <Basketball size={14} />
    {PLACEHOLDER_TEXT}
  </ButtonV2>
);

export const Default = Template.bind({});
Default.args = { variant: "default" };

export const Primary = Template.bind({});
Primary.args = { variant: "primary" };

export const Secondary = Template.bind({});
Secondary.args = { variant: "secondary" };

export const Tertiary = Template.bind({});
Tertiary.args = { variant: "tertiary" };

export const Danger = Template.bind({});
Danger.args = { variant: "danger" };
