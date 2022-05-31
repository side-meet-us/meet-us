import {
  Table,
  Flex,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Checkbox,
  Badge,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { useRecoilState } from 'recoil';
import { MdMoreHoriz } from 'react-icons/md';
import { checkedListState } from '../../recoil';
import { ListItem } from '../../types';
import ListFooter from './ListFooter';

interface Props {
  list: ListItem[];
  tableHeader: string[];
  buttonTitle?: string;
}

const ListTable = ({ list, tableHeader, buttonTitle }: Props) => {
  const [checkedList, setCheckedList] = useRecoilState(checkedListState);
  const allChecked = list.length > 0 && checkedList.length === list.length;
  const changeHandler = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    if (id === 0) {
      setCheckedList(event.target.checked ? list.map((v) => v.id) : []);
    } else if (event.target.checked) {
      setCheckedList((prev) => [...prev, id]);
    } else {
      setCheckedList((prev) => prev.filter((v) => v !== id));
    }
  };
  return (
    <TableContainer borderRadius="6px 6px 0px 0px">
      <Table>
        <Thead bg="gray.200">
          <Tr>
            {tableHeader.map((h) => {
              if (h === 'CHECKBOX') {
                return (
                  <Th key={h}>
                    <Checkbox
                      bg="white"
                      isChecked={allChecked}
                      onChange={(event) => {
                        changeHandler(event, 0);
                      }}
                    />
                  </Th>
                );
              } else if (h === 'MORE') {
                return <Th key={h} />;
              }
              return <Th key={h}>{h}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody bg="white">
          {list.map((item) => (
            <Tr key={item.id}>
              <Td>
                <Checkbox
                  isChecked={checkedList.includes(item.id)}
                  onChange={(event) => changeHandler(event, item.id)}
                />
              </Td>
              <Td>{item.subject}</Td>
              <Td>
                <Badge
                  variant="solid"
                  colorScheme={item.status === 'COMPLETED' ? 'green' : 'gray'}
                >
                  {item.status === 'COMPLETED'
                    ? `${buttonTitle} 발행`
                    : `${buttonTitle} 발행전`}
                </Badge>
              </Td>
              <Td>
                <Flex alignItems="center" justifyContent="space-evenly">
                  <Avatar />
                  {item.register}
                </Flex>
              </Td>
              <Td>{item.createdAt}</Td>
              <Td>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MdMoreHoriz />}
                    bg="white"
                  />
                  {item.status === 'REQUEST' && (
                    <MenuList minWidth="125px" p="2px">
                      <MenuItem h="25px">{buttonTitle} 발행 취소</MenuItem>
                    </MenuList>
                  )}
                  {item.status !== 'REQUEST' && (
                    <MenuList minWidth="125px" p="2px">
                      <MenuItem h="25px">{buttonTitle} 발행</MenuItem>
                      <MenuItem h="25px">{buttonTitle} 수정</MenuItem>
                      <MenuItem h="25px">{buttonTitle} 삭제</MenuItem>
                    </MenuList>
                  )}
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ListFooter />
    </TableContainer>
  );
};

ListTable.defaultProps = {
  buttonTitle: '',
};

export default ListTable;
