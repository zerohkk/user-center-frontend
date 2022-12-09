import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import {searchProduct, deleteProduct} from "@/services/ant-design-pro/api";
import {Button, Image, message} from "antd";
import {history} from "@@/core/history";
import {deleteUserParams} from "@/services/ant-design-pro/typings";
import {request} from "umi";
import {EllipsisOutlined, PlusOutlined} from "@ant-design/icons";
import Dropdown from "antd/es/dropdown";
// import { request } from 'umi';

const columns: ProColumns<API.CurrentProduct>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '商品名',
    dataIndex: 'productName',
    copyable: true,
  },
  {
    title: '商品照片',
    dataIndex: 'productImg',
    render: (_, record) => (
      <div>
        <Image src={record.productImg} width={100} />
      </div>
    ),
  },
  {
    title: '商品数量',
    dataIndex: 'productQuantity',
    // valueType: '',
  },
  {
    title: '商品类型',
    dataIndex: 'productType',
    copyable: true,
  },

  {
    title: '操作',
    valueType: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      // <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
      //   查看
      // </a>,
      // onSelect={() => action?.reload()}
      <TableDropdown
        key="actionGroup"
        onSelect={
            async (values) => {
              if(values==='delete') {
                  const params = {
                    id:record.id
                  }
                // const params =record.id;
                console.log(params);
                try {
                  await deleteProduct(params as  API.deleteProductParams);

                  const defaultLoginSuccessMessage = '删除成功！';
                  message.success(defaultLoginSuccessMessage);

                } catch (error: any) {
                  const defaultLoginFailureMessage = '删除失败，请重试！';
                  message.error(defaultLoginFailureMessage);
                }
                finally {
                  //刷新页面
                  location.reload();
                }
                }
              }
            }

        menus={[
          // { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentProduct>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        const productList = await searchProduct();
        return {
          data: productList
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
      }}
      dateFormatter="string"
      headerTitle="产品页"
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建
        </Button>,
        // <Dropdown
        //   key="menu"
        //   menu={{
        //     items: [
        //       {
        //         label: '1st item',
        //         key: '1',
        //       },
        //       {
        //         label: '2nd item',
        //         key: '1',
        //       },
        //       {
        //         label: '3rd item',
        //         key: '1',
        //       },
        //     ],
        //   }}
        // >
        //   <Button>
        //     <EllipsisOutlined />
        //   </Button>
        // </Dropdown>,
      ]}
    />
  );
};
