import { Laptop, Moon, Settings, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
  DrawerTitle,
  DrawerDescription
} from "@/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSettings } from '@/components/util/SettingsProvider';
import { Input } from '@/components/ui/input';
import { ReactNode, useMemo } from 'react';
import { useGame } from "@/components/util/GameProvider";

export const SettingsDialog = () => {
  const {
    setTheme,
    theme,
    boardDimensions,
    setBoardDimensions,
    connectionLength,
    setConnectionLength,
  } = useSettings();

  const { setGameLostFocus } = useGame();

  const StyledLabel = ({ htmlFor, children }: { htmlFor: string, children: ReactNode }) => (
    <Label className='max-w-fit align-middle justify-self-end mr-4 ml-auto my-auto' htmlFor={ htmlFor }>
      { children }
    </Label>
  );
    
  const ThemeRow = () => <>
    <StyledLabel htmlFor='theme'>Theme:</StyledLabel>
    <ToggleGroup
      className='justify-start'
      id='theme'
      type='single'
      value={ theme }
      onValueChange={ setTheme }
    >
      <ToggleGroupItem value='light'><Sun/></ToggleGroupItem>
      <ToggleGroupItem value='dark'><Moon/></ToggleGroupItem>
      <ToggleGroupItem value='system'><Laptop/></ToggleGroupItem>
    </ToggleGroup>
  </>

  const setDim = (axis: 'row' | 'col', e: React.ChangeEvent<HTMLInputElement>) => 
    setBoardDimensions({...boardDimensions, [axis]: parseInt(e.target.value, 10)})

  const getMinAxisLen = (axis: 'row' | 'col') => {
    const otherAxis = axis === 'row' ? 'col' : 'row';
    return boardDimensions[otherAxis] <= connectionLength ? connectionLength : 2;
  }

  const minAxisLen = useMemo(
    () => ({
      row:  boardDimensions.col <= connectionLength ? connectionLength : 2,
      col:  boardDimensions.row <= connectionLength ? connectionLength : 2,
    }),
    [boardDimensions, connectionLength]
  );

  const GridRow = () => <>
    <StyledLabel htmlFor='grid-size'>Grid-Size:</StyledLabel>
    <div id='grid-size' className='flex flex-row'>
      <Input
        className='w-20'
        type='number'
        min={ minAxisLen.col }
        max='100'
        onChange={ (e) => setDim('col', e) }
        value={boardDimensions.col}
      />
      <span className='text-4xl text-stone-700 mx-3'>/</span>
      <Input
        className='w-20'
        type='number'
        min={ minAxisLen.row }
        max='100'
        onChange={ (e) => setDim('row', e) }
        value={boardDimensions.row}
      />
    </div>
  </>

  const maxConnectionRow = useMemo(
    () => {
      const maxVal = Math.max(boardDimensions.row, boardDimensions.col);
      if (connectionLength > maxVal) setConnectionLength(maxVal);
      return maxVal;
    },
    [boardDimensions]
  )

  const ConnectionsRow = () => <>
    <StyledLabel htmlFor='connection-length'>Connections Length:</StyledLabel>
    <Input 
      id='connection-length'
      className='w-20'
      max={ maxConnectionRow }
      min={ 2 }
      value={ connectionLength }
      onChange={ (e) => setConnectionLength(parseInt(e.target.value, 10)) }
      type='number'
    />
  </>

  return (
    // onClose, wait a little bit to re-enable game focus
    <Drawer onClose={ () => setTimeout(() => setGameLostFocus(false), 200) }>
      <DrawerTrigger className='fixed bottom-0 right-0 m-5' asChild>
        <Button variant="outline" size="icon" onClick={ () => setGameLostFocus(true) }>
          <Settings className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100"/>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Game Settings</DrawerTitle>
          <DrawerDescription>
            Just different settings regarding what kind of game you're playing
          </DrawerDescription>
        </DrawerHeader>
        <div className='grid gap-4 py-4 max-w-full justify-center'>
          <div className='grid grid-cols-2 max-w-fit gap-y-4'>
            <ThemeRow/>
            <GridRow/>
            <ConnectionsRow/>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default SettingsDialog;