import * as b from "bobril";
import { IExtendedEventInfo } from "shared/event";
import {
  ButtonGroup,
  Button,
  Glyphicon,
  GlyphIcon,
  ButtonVariant,
  DropdownMenu,
  DropdownItem,
  Anchor
} from "bobrilstrap";

export interface IData<TMovie extends IExtendedEventInfo> {
  tags: ITagInfo[];
  filter: IFilter<TMovie>[];
  eventCount: number;
  selectedCount: number;
  onChange: (f: IFilter<TMovie>[]) => void;
  getDurationsInMinutes: (movie: TMovie) => number[];
}

export interface ITagInfo {
  name: string;
  selectionCount: number;
}

export interface IFilter<TMovie extends IExtendedEventInfo> {
  id: string;
  test: (ev: TMovie) => boolean;
}

export const create = b.component(
  <TMovie extends IExtendedEventInfo>(data: IData<TMovie>) => (
    <div>
      Filtr:&nbsp;
      <ButtonGroup>
        {...data.filter.map(f => (
          <Button
            title={f.id}
            onClick={() =>
              data.onChange(data.filter.filter(f2 => f2.id !== f.id))
            }
          >
            {f.id} <Glyphicon icon={GlyphIcon.Trash}></Glyphicon>
          </Button>
        ))}
        <ButtonGroup>
          <Button title="Přidat" variant={ButtonVariant.Dropdown}>
            <Glyphicon icon={GlyphIcon.Plus}></Glyphicon>
          </Button>
          <DropdownMenu>
            {data.tags
              .filter(
                tag =>
                  data.filter.map(f => f.id).indexOf(tag.name) < 0 &&
                  tag.selectionCount > 0
              )
              .map(tag => (
                <DropdownItem
                  onClick={() =>
                    data.onChange([...data.filter, createTagFilter(tag.name)])
                  }
                >
                  <Anchor>
                    {tag.name} ({tag.selectionCount})
                  </Anchor>
                </DropdownItem>
              ))}
            {[
              createTimeFilter(0, 60, data.getDurationsInMinutes),
              createTimeFilter(0, 90, data.getDurationsInMinutes),
              createTimeFilter(60, 999, data.getDurationsInMinutes),
              createTimeFilter(80, 999, data.getDurationsInMinutes)
            ]
              .filter(f => data.filter.map(f => f.id).indexOf(f.id) < 0)
              .map(f => (
                <DropdownItem
                  onClick={() => data.onChange([...data.filter, f])}
                >
                  <Anchor>{f.id}</Anchor>
                </DropdownItem>
              ))}
          </DropdownMenu>
        </ButtonGroup>
      </ButtonGroup>
      &nbsp;({data.selectedCount}/{data.eventCount})
    </div>
  )
) as <TMovie extends IExtendedEventInfo>(
  data?: IData<TMovie>,
  children?: b.ChildrenType<IData<TMovie>>
) => b.IBobrilNode<IData<TMovie>>;

export function createTagFilter<TMovie extends IExtendedEventInfo>(
  tagName: string
): IFilter<TMovie> {
  return {
    id: tagName,
    test: e => e.tags.indexOf(tagName) >= 0
  };
}

export function createTimeFilter<TMovie extends IExtendedEventInfo>(
  from: number,
  to: number,
  getDurationsInMinutes: (movie: TMovie) => number[]
): IFilter<TMovie> {
  return {
    id: `${from}-${to} minut`,
    test: e =>
      getDurationsInMinutes(e).some(
        durationInMinutes =>
          durationInMinutes >= from && durationInMinutes <= to
      )
  };
}
