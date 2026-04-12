import { Text } from "../catalog/text";
import { Row } from "../catalog/row";
import { Column } from "../catalog/column";
import { Image } from "../catalog/image";
import { Icon } from "../catalog/icon";
import { Button } from "../catalog/button";
import { Card } from "../catalog/card";
import { Tabs } from "../catalog/tabs";
import { Modal } from "../catalog/modal";
import { Checkbox } from "../catalog/checkbox";
import { TextField } from "../catalog/text-field";
import { DateTimeInput } from "../catalog/datetime-input";
import { Slider } from "../catalog/slider";
import { MultipleChoice } from "../catalog/multiple-choice";
import { List } from "../catalog/list";
import { Divider } from "../catalog/divider";
import { Video } from "../catalog/video";
import { AudioPlayer } from "../catalog/audio-player";
import { Table } from "../catalog/table";
import Chart from "../catalog/chart";

export type ComponentConfig = {
  component: React.ComponentType<any>;
};

export type Catalog = {
  [key: string]: ComponentConfig;
};

export const DEFAULT_CATALOG: Catalog = {
  Text: { component: Text },
  Row: { component: Row },
  Column: { component: Column },
  Image: { component: Image },
  Icon: { component: Icon },
  Button: { component: Button },
  Card: { component: Card },
  Tabs: { component: Tabs },
  Modal: { component: Modal },
  CheckBox: { component: Checkbox },
  TextField: { component: TextField },
  DateTimeInput: { component: DateTimeInput },
  Slider: { component: Slider },
  MultipleChoice: { component: MultipleChoice },
  List: { component: List },
  Divider: { component: Divider },
  Video: { component: Video },
  AudioPlayer: { component: AudioPlayer },
  Table: { component: Table },
  Chart: { component: Chart },
};
